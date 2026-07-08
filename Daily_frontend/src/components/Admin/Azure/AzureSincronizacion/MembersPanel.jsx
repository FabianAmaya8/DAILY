import { Badge } from "../../../ui/Badge";
import { EmptyState } from "../../../ui/EmptyState";
import { Users } from "lucide-react";
import { getMemberStatus, initials } from "./utils";
import styles from "../../../../assets/css/Admin/DatosAzure.module.scss";

export function MembersPanel({ selectedTeam, selectedTeamMembers }) {
    if (!selectedTeam) {
        return (
            <EmptyState
                icon={Users}
                title="Selecciona un equipo"
                description="Los miembros se cargan a partir de la relación equipo-miembro."
            />
        );
    }

    if (selectedTeamMembers.length === 0) {
        return (
            <EmptyState
                icon={Users}
                title="Este equipo no tiene miembros"
                description="No se encontraron relaciones en ado_team_members para el equipo seleccionado."
            />
        );
    }

    return (
        <div className={styles.membersGrid}>
            {selectedTeamMembers.map((member) => {
                const memberState = getMemberStatus(member);
                const avatarSrc =
                    member.avatar_url ||
                    member.image_url ||
                    member.profile_url ||
                    null;

                return (
                    <article key={member.azure_user_id} className={styles.memberCard}>
                        <div className={styles.memberAvatar}>
                            {avatarSrc ? (
                                <img src={avatarSrc} alt={member.display_name || "Avatar"} />
                            ) : (
                                <span>{initials(member.display_name || member.email)}</span>
                            )}
                        </div>
                        <div className={styles.memberMeta}>
                            <div className={styles.memberName}>
                                {member.display_name || "Sin nombre"}
                            </div>
                            <div className={styles.memberEmail}>
                                {member.email || "Sin correo"}
                            </div>
                            <Badge variant={memberState.variant} size="sm">
                                {memberState.label}
                            </Badge>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
