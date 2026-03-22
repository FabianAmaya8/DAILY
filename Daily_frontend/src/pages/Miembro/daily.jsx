import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dailySchema } from "../../types/daily.types";
import { supabase } from "../../utils/supabaseClient";
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

        const { error } = await supabase.from("dailys").upsert({
            ...values,
            persona_id: user.id,
            fecha: new Date().toISOString().split("T")[0],
        });

        if (error) {
            toast("Ya existe un daily hoy", "error");
            return;
        }

        toast("Daily registrado correctamente", "success");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <textarea {...register("que_hice_ayer")} />
            <textarea {...register("que_hare_hoy")} />
            <button type="submit">Guardar</button>
        </form>
    );
}
