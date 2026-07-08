import { Badge } from "../../../ui/Badge";
import { Modal } from "../../../ui/Modal";
import { TeamsTable } from "./TeamsTable";
import { MembersPanel } from "./MembersPanel";
import {
    formatNumber,
    getProjectStatusVariant,
    getVisibilityVariant,
} from "./utils";
import styles from "../../../../assets/css/Admin/DatosAzure.module.scss";

export function ProjectDetailsModal({
    open,
    onClose,
    project,
    projectStats,
    selectedTeamId,
    onSelectTeam,
    selectedProjectTeams,
    selectedTeam,
    selectedTeamMembers,
    getTeamMemberCount,
}) {
    if (!project) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={project.nombre || "Detalle del proyecto"}
            description={project.azure_project_id || "Proyecto Azure DevOps"}
            size=""
            className={styles.projectDetailsModal}
        >
            <div className={styles.projectDetailsBody}>
                <section className={styles.projectDetailsHeader}>
                    <div className={styles.projectDetailsBadges}>
                        {project.estado ? (
                            <Badge
                                variant={getProjectStatusVariant(project.estado)}
                                size="sm"
                                className={styles.statusBadge}
                            >
                                {project.estado}
                            </Badge>
                        ) : null}
                        <Badge
                            variant={getVisibilityVariant(project.visibilidad)}
                            size="sm"
                            className={styles.visibilityBadge}
                        >
                            {project.visibilidad || "—"}
                        </Badge>
                        <span className={styles.revisionPill}>{project.revision ?? "—"}</span>
                    </div>

                    <div className={styles.projectDetailsMetrics}>
                        <div className={styles.projectDetailsMetric}>
                            <div className={styles.projectDetailsMetricValue}>
                                {formatNumber(projectStats?.teamCount || 0)}
                            </div>
                            <div className={styles.projectDetailsMetricLabel}>Equipos</div>
                        </div>
                        <div className={styles.projectDetailsMetric}>
                            <div className={styles.projectDetailsMetricValue}>
                                {formatNumber(projectStats?.memberCount || 0)}
                            </div>
                            <div className={styles.projectDetailsMetricLabel}>Miembros</div>
                        </div>
                    </div>
                </section>

                <div className={styles.projectDetailsGrid}>
                    <section className={styles.projectDetailsColumn}>
                        <div className={styles.projectDetailsSectionHeader}>
                            <h3 className={styles.projectDetailsSectionTitle}>Equipos</h3>
                        </div>
                        <TeamsTable
                            selectedProject={project}
                            selectedProjectTeams={selectedProjectTeams}
                            selectedTeamId={selectedTeamId}
                            onSelectTeam={onSelectTeam}
                            getTeamMemberCount={getTeamMemberCount}
                        />
                    </section>

                    <section className={styles.projectDetailsColumn}>
                        <div className={styles.projectDetailsSectionHeader}>
                            <h3 className={styles.projectDetailsSectionTitle}>Miembros</h3>
                        </div>
                        <MembersPanel
                            selectedTeam={selectedTeam}
                            selectedTeamMembers={selectedTeamMembers}
                        />
                    </section>
                </div>
            </div>
        </Modal>
    );
}
