import { useState } from "react";
import Swal from "sweetalert2";
import { ClipboardList } from "lucide-react";
import { useTranscriptDaily } from "../../hooks/PowerAutomate/useTranscriptDaily";
import { useGuardarDaily } from "../../hooks/useGuardarDaily";
import DailyForm from "../../components/Lider/RegistroDaily/DailyForm";
import DailyResult from "../../components/Lider/RegistroDaily/DailyResult";
import Cargando from "../../components/Depen/Cargando";
import styles from "../../assets/css/Lider/RegistrarDaily.module.scss";

export default function RegistrarDaily() {
    const { sendTranscript, loading } = useTranscriptDaily();
    const {
        equipos,
        personas,
        seleccionarEquipo,
        guardarDailyCompleto,
        loading: loadingGuardar,
        error,
    } = useGuardarDaily();

    const [response, setResponse] = useState();

    const handleSubmit = async (formData) => {
        const result = await sendTranscript(formData);
        if (result) setResponse(result);
    };

    const handleGuardar = async () => {
        const ok = await guardarDailyCompleto(response);
        if (ok) {
            Swal.fire({
                icon: "success",
                title: "Daily guardado con éxito",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    if (loadingGuardar || loading) return <Cargando />;

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>
                    <ClipboardList size={20} aria-hidden="true" />
                    Registrar daily del equipo
                </h1>
                <p className={styles.subtitle}>
                    Procesa la transcripción de la reunión y registra los
                    dailys de cada miembro automáticamente.
                </p>
            </header>

            {!response ? (
                <DailyForm
                    equipos={equipos}
                    seleccionarEquipo={seleccionarEquipo}
                    personas={personas}
                    onSubmit={handleSubmit}
                    loading={loading}
                />
            ) : (
                <DailyResult
                    data={response}
                    personas={personas}
                    handleGuardar={handleGuardar}
                    loading={loadingGuardar}
                    error={error}
                />
            )}
        </div>
    );
}
