import { z } from "zod";

export const dailySchema = z.object({
    yesterday_text: z.string().min(5),
    today_text: z.string().min(5),
    blockers_text: z.string().optional(),
    load_model: z.enum(["tshirt", "points", "percent"]),
    load_value: z.string().min(1),
    confidence: z.enum(["Alta", "Media", "Baja"]),
});
