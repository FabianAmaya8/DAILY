import { Card } from "../../../ui/Card";
import { formatDate, formatNumber } from "./utils";
import styles from "../../../../assets/css/Admin/AzureMiembros.module.scss";

export function SummaryCards({
    membersCount,
    teamsCount,
    projectsCount,
    lastSyncedAt,
    dataLoading,
}) {
    const summaryCards = [
        {
            label: "Total de miembros",
            value: formatNumber(membersCount),
            hint: "Registros sincronizados en ado_members",
        },
        {
            label: "Total de equipos",
            value: formatNumber(teamsCount),
            hint: "Registros sincronizados en ado_teams",
        },
        {
            label: "Total de proyectos",
            value: formatNumber(projectsCount),
            hint: "Registros sincronizados en ado_projects",
        },
        {
            label: "Última sincronización",
            value: formatDate(lastSyncedAt),
            hint: dataLoading
                ? "Consultando la fuente sincronizada..."
                : "Último cambio observado en los datos",
        },
    ];

    return (
        <section className={styles.summaryGrid} aria-label="Resumen Azure DevOps">
            {summaryCards.map((card) => (
                <Card key={card.label} className={styles.summaryCard} padding="md">
                    <div className={styles.summaryLabel}>{card.label}</div>
                    <div className={styles.summaryValue}>{card.value}</div>
                    <div className={styles.summaryHint}>{card.hint}</div>
                </Card>
            ))}
        </section>
    );
}

