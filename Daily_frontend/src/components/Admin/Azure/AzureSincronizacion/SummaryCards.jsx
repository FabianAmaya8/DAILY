import { Card } from "../../../ui/Card";
import { formatDate, formatNumber } from "./utils";
import styles from "../../../../assets/css/Admin/DatosAzure.module.scss";

export function SummaryCards({
    projectsCount,
    teamsCount,
    membersCount,
    teamMembersCount,
    lastLoadedAt,
    dataLoading,
    syncErrorsCount,
}) {
    const summaryCards = [
        {
            label: "Proyectos",
            value: formatNumber(projectsCount),
            hint: "ado_projects",
        },
        {
            label: "Equipos",
            value: formatNumber(teamsCount),
            hint: "ado_teams",
        },
        {
            label: "Miembros",
            value: formatNumber(membersCount),
            hint: "ado_members",
        },
        {
            label: "Relaciones",
            value: formatNumber(teamMembersCount),
            hint: "ado_team_members",
        },
        {
            label: "Última carga",
            value: formatDate(lastLoadedAt),
            hint: dataLoading ? "Cargando desde Supabase..." : "Supabase como fuente de verdad",
        },
        {
            label: "Sincronización",
            value: syncErrorsCount ? "Con alertas" : "Lista",
            hint: syncErrorsCount
                ? `${syncErrorsCount} proyecto(s) con error`
                : "Solo bajo demanda del administrador",
        },
    ];

    return (
        <section className={styles.summaryGrid} aria-label="Resumen Azure">
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
