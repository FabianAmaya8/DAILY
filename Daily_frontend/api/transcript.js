/**
 * /api/transcript · Vercel Serverless Function
 * ----------------------------------------------
 * Proxy seguro al webhook de Power Automate.
 *
 * MOTIVO: el webhook URL no debe vivir en el bundle público (VITE_*),
 * porque cualquier usuario con DevTools podría abusarlo.
 * Esta función actúa como puerta:
 *
 *   1. Valida que la petición trae un access_token de Supabase válido
 *   2. Rate-limit ligero por usuario (memoria del proceso)
 *   3. Reenvía el payload al webhook real con la URL guardada en
 *      `process.env.POWER_AUTOMATE_WEBHOOK_URL` (configurar en Vercel
 *      Dashboard → Project Settings → Environment Variables)
 *
 * El cliente NUNCA ve la URL del webhook.
 *
 * Configurar en Vercel Dashboard:
 *   Settings → Environment Variables:
 *     - SUPABASE_URL                = (mismo de VITE_SUPABASE_URL)
 *     - SUPABASE_ANON_KEY           = (mismo de VITE_SUPABASE_ANON_KEY)
 *     - POWER_AUTOMATE_WEBHOOK_URL  = (la URL real del flow)
 */

import { createClient } from "@supabase/supabase-js";

// Rate limit muy básico (memoria por proceso, suficiente para arranque).
// Para producción seria, migrar a Vercel KV o Upstash Redis.
const MAX_PER_MINUTE = 12;
const buckets = new Map();

function checkRateLimit(userId) {
    const now = Date.now();
    const window = 60_000;
    const bucket = buckets.get(userId) || { count: 0, ts: now };
    if (now - bucket.ts > window) {
        bucket.count = 0;
        bucket.ts = now;
    }
    bucket.count += 1;
    buckets.set(userId, bucket);
    return bucket.count <= MAX_PER_MINUTE;
}

export default async function handler(req, res) {
    // CORS: la función vive en el mismo origen que la SPA → no hace falta
    // CORS abierto. Solo aceptamos POST.
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed" });
    }

    // 1. Token Supabase obligatorio
    const auth = req.headers["authorization"] || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
        return res.status(401).json({ error: "Missing bearer token" });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const webhook = process.env.POWER_AUTOMATE_WEBHOOK_URL;

    if (!supabaseUrl || !supabaseAnonKey || !webhook) {
        // No leakear qué falta en producción
        return res.status(500).json({ error: "Server misconfigured" });
    }

    // 2. Validar el token llamando a Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const {
        data: { user },
        error: userErr,
    } = await supabase.auth.getUser(token);

    if (userErr || !user) {
        return res.status(401).json({ error: "Invalid token" });
    }

    // 3. Rate limit por usuario
    if (!checkRateLimit(user.id)) {
        return res
            .status(429)
            .json({ error: "Too many requests. Try again later." });
    }

    // 4. Forward al webhook real
    try {
        const payload = req.body || {};
        const upstream = await fetch(webhook, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Reenviamos un identificador del usuario para que el flow
                // sepa quién originó la petición, sin exponer el token.
                "x-daily-user-id": user.id,
                "x-daily-user-email": user.email || "",
            },
            body: JSON.stringify(payload),
        });

        if (!upstream.ok) {
            const text = await upstream.text();
            return res.status(upstream.status).json({
                error: "Power Automate flow failed",
                status: upstream.status,
                detail: text.slice(0, 300),
            });
        }

        // El flow devuelve JSON o texto. Pasamos tal cual.
        const contentType = upstream.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const data = await upstream.json();
            return res.status(200).json(data);
        }
        const text = await upstream.text();
        return res.status(200).send(text);
    } catch (err) {
        return res.status(502).json({
            error: "Failed to reach Power Automate",
            detail: String(err?.message || err).slice(0, 300),
        });
    }
}
