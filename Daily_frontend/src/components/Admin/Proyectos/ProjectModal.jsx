import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Modal } from "../../ui/Modal";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

const TIPOS = [
    { value: "", label: "Seleccionar tipo…" },
    { value: "RPA", label: "RPA" },
    { value: "BI", label: "BI" },
    { value: "PP", label: "Power Platform" },
];

const PRIORIDADES = ["Alta", "Media", "Baja"];

const EMPTY_FORM = {
    nombre: "",
    cliente_area: "",
    tipo: "",
    estado: "Activo",
    prioridad: "Media",
    lider_proyecto_id: "",
};

export default function ProjectModal({
    isOpen,
    onClose,
    onSave,
    project,
    people = [],
}) {
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (project) {
            setForm({
                nombre: project.nombre || "",
                cliente_area: project.cliente_area || "",
                tipo: project.tipo || "",
                estado: project.estado || "Activo",
                prioridad: project.prioridad || "Media",
                lider_proyecto_id: project.lider_proyecto_id || "",
            });
        } else {
            setForm(EMPTY_FORM);
        }
    }, [project]);

    const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title={project ? "Editar proyecto" : "Nuevo proyecto"}
            description={
                project
                    ? "Modifica los campos y guarda los cambios."
                    : "Crea un nuevo proyecto y asigna su líder."
            }
            size="md"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="project-form"
                        variant="primary"
                        leftIcon={Save}
                    >
                        Guardar
                    </Button>
                </>
            }
        >
            <form
                id="project-form"
                onSubmit={handleSubmit}
                noValidate
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-md)",
                }}
            >
                <Input
                    label="Nombre"
                    value={form.nombre}
                    onChange={set("nombre")}
                    required
                />

                <Input
                    label="Cliente / Área"
                    value={form.cliente_area}
                    onChange={set("cliente_area")}
                />

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "var(--space-md)",
                    }}
                >
                    <Field label="Tipo">
                        <select value={form.tipo} onChange={set("tipo")}>
                            {TIPOS.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Prioridad">
                        <select
                            value={form.prioridad}
                            onChange={set("prioridad")}
                        >
                            {PRIORIDADES.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>

                <Field label="Líder del proyecto">
                    <select
                        value={form.lider_proyecto_id || ""}
                        onChange={set("lider_proyecto_id")}
                    >
                        <option value="">Sin asignar</option>
                        {people.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>
                </Field>
            </form>
        </Modal>
    );
}

function Field({ label, children }) {
    return (
        <label
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                fontSize: "var(--font-xs)",
                fontWeight: "var(--weight-medium)",
                color: "var(--color-text-secondary)",
                letterSpacing: "var(--tracking-tight)",
            }}
        >
            {label}
            {children}
        </label>
    );
}
