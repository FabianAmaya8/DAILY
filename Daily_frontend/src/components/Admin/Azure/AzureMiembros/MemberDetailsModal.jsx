import { Badge } from "../../../ui/Badge";
import { Modal } from "../../../ui/Modal";
import { formatDate, formatDateOnly, formatNumber, getMemberAvatar, getMemberStatus, initials } from "./utils";
import styles from "../../../../assets/css/Admin/AzureMiembros.module.scss";

function RelationGrid({ title, items = [], emptyLabel }) {
    return (
        <section className={styles.detailColumn}>
            <div className={styles.detailSectionHeader}>
                <h3 className={styles.detailSectionTitle}>{title}</h3>
            </div>

            {items.length === 0 ? (
                <div className={styles.detailEmptyText}>{emptyLabel}</div>
            ) : (
                <div className={styles.detailTagGrid}>
                    {items.map((item) => (
                        <Badge key={item.id} variant="info" size="sm" className={styles.detailTag}>
                            {item.label}
                        </Badge>
                    ))}
                </div>
            )}
        </section>
    );
}

export function MemberDetailsModal({ open, onClose, member }) {
    if (!member) return null;

    const memberStatus = getMemberStatus(member);
    const avatarUrl = getMemberAvatar(member);

    const teams = (member.teams || []).map((team) => ({
        id: team.azure_team_id,
        label: team.nombre || team.azure_team_id,
    }));

    const projects = (member.projects || []).map((project) => ({
        id: project.azure_project_id,
        label: project.nombre || project.azure_project_id,
    }));

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={member.display_name || "Detalle del miembro"}
            description={member.email || member.azure_user_id || "Miembro Azure DevOps"}
            size="lg"
            className={styles.detailModal}
        >
            <div className={styles.detailBody}>
                <section className={styles.detailHeader}>
                    <div className={styles.detailIdentity}>
                        <div className={styles.detailAvatar}>
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={member.display_name || "Avatar"}
                                    className={styles.detailAvatarImg}
                                />
                            ) : (
                                <span className={styles.detailAvatarInitials}>
                                    {initials(member.display_name || member.email)}
                                </span>
                            )}
                        </div>

                        <div className={styles.detailTitleBlock}>
                            <div className={styles.detailName}>
                                {member.display_name || "Sin nombre"}
                            </div>
                            <div className={styles.detailEmail}>
                                {member.email || "Sin correo"}
                            </div>
                            <div className={styles.detailBadges}>
                                <Badge variant={memberStatus.variant} size="sm">
                                    {memberStatus.label}
                                </Badge>
                                <Badge variant="neutral" size="sm">
                                    Azure ID: {member.azure_user_id || "Sin dato"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className={styles.detailMetrics}>
                        <div className={styles.detailMetric}>
                            <div className={styles.detailMetricValue}>
                                {formatNumber(member.teamCount || 0)}
                            </div>
                            <div className={styles.detailMetricLabel}>Equipos</div>
                        </div>

                        <div className={styles.detailMetric}>
                            <div className={styles.detailMetricValue}>
                                {formatNumber(member.projectCount || 0)}
                            </div>
                            <div className={styles.detailMetricLabel}>Proyectos</div>
                        </div>
                    </div>
                </section>

                <section className={styles.detailInfoGrid}>
                    <div className={styles.detailInfoItem}>
                        <div className={styles.detailInfoLabel}>Fecha de sincronización</div>
                        <div className={styles.detailInfoValue}>
                            {formatDate(member.lastUpdatedAt || member.updated_at || member.actualizado_en)}
                        </div>
                    </div>

                    <div className={styles.detailInfoItem}>
                        <div className={styles.detailInfoLabel}>Última actualización registrada</div>
                        <div className={styles.detailInfoValue}>
                            {formatDateOnly(member.lastUpdatedAt || member.updated_at || member.actualizado_en)}
                        </div>
                    </div>
                </section>

                <div className={styles.detailGrid}>
                    <RelationGrid
                        title="Equipos"
                        items={teams}
                        emptyLabel="Este miembro no tiene equipos asociados."
                    />

                    <RelationGrid
                        title="Proyectos"
                        items={projects}
                        emptyLabel="Este miembro no tiene proyectos asociados."
                    />
                </div>
            </div>
        </Modal>
    );
}

