import { Pencil, Trash2, Eye, Crown, Users } from "lucide-react";
import Swal from "sweetalert2";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import styles from "../../../assets/css/Admin/Equipos.module.scss";

export default function EquipoCard({
    equipo,
    editarEquipo,
    eliminarEquipo,
    onView,
}) {
    const handleDelete = async () => {
        const ok = await Swal.fire({
            icon: "warning",
            title: `Eliminar "${equipo.nombre}"?`,
            text: "Se desvinculará a todos los miembros del equipo.",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc2626",
        });
        if (ok.isConfirmed) eliminarEquipo(equipo.id);
    };

    return (
        <Card padding="md" className={styles.card}>
            <header className={styles.cardHeader}>
                <h3 className={styles.teamName}>{equipo.nombre}</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={Pencil}
                    onClick={() => editarEquipo(equipo.id)}
                    aria-label="Editar equipo"
                />
            </header>

            <dl className={styles.meta}>
                <div className={styles.metaRow}>
                    <Crown
                        size={13}
                        aria-hidden="true"
                        className={styles.metaIcon}
                    />
                    <dt>Líder</dt>
                    <dd>
                        {equipo.lider?.nombre ? (
                            equipo.lider.nombre
                        ) : (
                            <Badge variant="neutral" size="sm">
                                Sin líder
                            </Badge>
                        )}
                    </dd>
                </div>
                <div className={styles.metaRow}>
                    <Users
                        size={13}
                        aria-hidden="true"
                        className={styles.metaIcon}
                    />
                    <dt>Miembros</dt>
                    <dd>
                        <Badge variant="primary" size="sm">
                            {equipo.miembros?.length ?? 0}
                        </Badge>
                    </dd>
                </div>
            </dl>

            <footer className={styles.cardActions}>
                <Button
                    variant="primary"
                    size="sm"
                    leftIcon={Eye}
                    onClick={onView}
                >
                    Ver equipo
                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    leftIcon={Trash2}
                    onClick={handleDelete}
                >
                    Eliminar
                </Button>
            </footer>
        </Card>
    );
}
