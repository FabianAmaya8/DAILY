import clsx from "clsx";
import {
    FolderKanban,
    Users,
    UsersRound,
    RefreshCcw,
    CalendarClock,
    CheckCircle2,
} from "lucide-react";

import { Badge } from "../../../ui/Badge";

import {
    formatDate,
    formatDateOnly,
    formatHour,
    formatNumber,
    getProjectStatusVariant,
    getVisibilityVariant,
} from "./utils";

import styles from "../../../../assets/css/Admin/DatosAzure.module.scss";

export function ProjectsTable({
    projects,
    selectedProjectId,
    onSelectProject,
}) {

    return (
        <div className={styles.projectsCardsGrid}>

            {projects.map((project) => {

                const isSelected =
                    project.azure_project_id === selectedProjectId;

                return (

                    <article
                        key={project.azure_project_id}
                        className={clsx(
                            styles.projectCard,
                            isSelected && styles.projectCardSelected
                        )}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                            onSelectProject?.(project.azure_project_id)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onSelectProject?.(
                                    project.azure_project_id
                                );
                            }
                        }}
                    >

                        {/* HEADER */}

                        <div className={styles.projectCardHeader}>

                            <div className={styles.projectCardTitle}>

                                <div className={styles.projectCardIcon}>
                                    <FolderKanban size={22} />
                                </div>

                                <div className={styles.projectCardTitleContent}>

                                    <h3
                                        className={styles.projectCardName}
                                        title={project.nombre}
                                    >
                                        {project.nombre}
                                    </h3>

                                    <span
                                        className={styles.projectCardId}
                                        title={project.azure_project_id}
                                    >
                                        {project.azure_project_id}
                                    </span>

                                </div>

                            </div>

                            <div className={styles.projectCardBadges}>

                                <Badge
                                    variant={getProjectStatusVariant(project.estado)}
                                    size="sm"
                                >
                                    {project.estado}
                                </Badge>

                                <Badge
                                    variant={getVisibilityVariant(project.visibilidad)}
                                    size="sm"
                                >
                                    {project.visibilidad}
                                </Badge>

                            </div>

                        </div>

                        {/* DIVIDER */}

                        <div className={styles.projectCardDivider} />

                        {/* MÉTRICAS */}

                        <div className={styles.projectCardMetrics}>

                            <div className={styles.projectMetric}>

                                <div className={styles.projectMetricIcon}>
                                    <UsersRound size={18} />
                                </div>

                                <div>

                                    <div className={styles.projectMetricValue}>
                                        {formatNumber(project.teamCount || 0)}
                                    </div>

                                    <div className={styles.projectMetricLabel}>
                                        Equipos
                                    </div>

                                </div>

                            </div>

                            <div className={styles.projectMetric}>

                                <div className={styles.projectMetricIcon}>
                                    <Users size={18} />
                                </div>

                                <div>

                                    <div className={styles.projectMetricValue}>
                                        {formatNumber(project.memberCount || 0)}
                                    </div>

                                    <div className={styles.projectMetricLabel}>
                                        Miembros
                                    </div>

                                </div>

                            </div>

                            <div className={styles.projectMetric}>

                                <div className={styles.projectMetricIcon}>
                                    <RefreshCcw size={18} />
                                </div>

                                <div>

                                    <div className={styles.projectMetricValue}>
                                        {project.revision}
                                    </div>

                                    <div className={styles.projectMetricLabel}>
                                        Revisión
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* FOOTER */}

                        <div className={styles.projectCardFooter}>

                            <div className={styles.projectFooterDate}>

                                <CalendarClock size={16} />

                                <div>

                                    <div className={styles.projectFooterPrimary}>
                                        {formatDateOnly(project.ultima_actualizacion)}
                                    </div>

                                    <div className={styles.projectFooterSecondary}>
                                        {formatHour(project.ultima_actualizacion)}
                                    </div>

                                </div>

                            </div>

                            <span
                                className={styles.projectFooterTooltip}
                                title={formatDate(project.ultima_actualizacion)}
                            >
                                Última actualización
                            </span>

                        </div>

                    </article>

                );

            })}

        </div>
    );
}
