import { z } from "zod";

export const personSchema = z.object({
    display_name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    role: z.enum(["miembro", "lider", "admin"]),
    capacity_hours_week: z.number().min(1),
    timezone: z.string(),
    active: z.boolean(),
});
