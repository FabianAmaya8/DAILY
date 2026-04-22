import React, { useState } from "react";
import Swal from "sweetalert2";
import styles from "../../assets/css/Lider/RegistrarDaily.module.scss";
import { useTranscriptDaily } from "../../hooks/PowerAutomate/useTranscriptDaily";
import { useGuardarDaily } from "../../hooks/useGuardarDaily";
import DailyForm from "../../components/Lider/RegistroDaily/DailyForm";
import DailyResult from "../../components/Lider/RegistroDaily/DailyResult";
import Cargando from "../../components/Depen/Cargando";

export default function RegistrarDaily() {
    const { sendTranscript, loading } = useTranscriptDaily();
    const { 
        equipos,
        personas,
        seleccionarEquipo,
        guardarDailyCompleto,
        loading : loadingGuardar,
        error 
    } = useGuardarDaily();

    const [response, setResponse] = useState();

    const handleSubmit = async (formData) => {
        const result = await sendTranscript(formData);

        if (result) {
            setResponse(result);
        }
    };

    const handleGuardar = async () => {
        const ok = await guardarDailyCompleto(response);

        if (ok) {
            Swal.fire({
                icon: "success",
                title: "Daily guardado con éxito",
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };

    if (loadingGuardar) {
        return <Cargando />;
    }

    return (
        <div className={styles.container}>
            {!response ? (
                <DailyForm 
                    equipos={equipos}
                    seleccionarEquipo={seleccionarEquipo}
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