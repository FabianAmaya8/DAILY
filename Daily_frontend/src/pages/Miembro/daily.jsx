import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dailySchema } from "../../types/daily.types";
import { supabase } from "../../lib/supabaseClient";
import { useToast } from "../../hooks/useToast";

export default function DailyForm() {
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(dailySchema),
    });

    const onSubmit = async (values) => {
        const user = (await supabase.auth.getUser()).data.user;

        const { error } = await supabase.from("daily_updates").upsert({
            ...values,
            person_id: user.id,
            date: new Date().toISOString().split("T")[0],
        });

        if (error) {
            toast("Ya existe un daily hoy", "error");
            return;
        }

        await fetch("/api/notify-teams", { method: "POST" });

        toast("Daily registrado correctamente", "success");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <textarea {...register("yesterday_text")} />
            <textarea {...register("today_text")} />
            <button type="submit">Guardar</button>
        </form>
    );
}
