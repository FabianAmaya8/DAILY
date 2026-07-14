import clsx from "clsx";
import { Badge } from "../../../ui/Badge";
import { getMemberStatus, getMemberAvatar, initials, formatDate, formatNumber } from "./utils";
import styles from "../../../../assets/css/Admin/AzureMiembros.module.scss";

export function MembersTable({
    members = [],
    selectedMemberId,
    onSelectMember,
}) {
    return (
        <div className={clsx(styles.tableContainer, styles.membersTableContainer)}>
            <table className={clsx(styles.table, styles.membersTable)}>
                <colgroup>
                    <col style={{ width: "7%" }} />
                    <col style={{ width: "24%" }} />
                    <col style={{ width: "24%" }} />
                    <col style={{ width: "11%" }} />
                    <col style={{ width: "11%" }} />
                    <col style={{ width: "11%" }} />
                    <col style={{ width: "12%" }} />
                </colgroup>

                <thead>
                    <tr>
                        <th className={styles.thAvatar}>Avatar</th>
                        <th className={styles.thName}>Nombre</th>
                        <th>Correo</th>
                        <th className={styles.thState}>Estado</th>
                        <th className={styles.thNumeric}>Equipos</th>
                        <th className={styles.thNumeric}>Proyectos</th>
                        <th>Última actualización</th>
                    </tr>
                </thead>

                <tbody>
                    {members.map((member) => {
                        const isSelected = member.azure_user_id === selectedMemberId;
                        const memberStatus = getMemberStatus(member);
                        const avatarUrl = getMemberAvatar(member);

                        return (
                            <tr
                                key={member.azure_user_id}
                                className={clsx(styles.memberRow, isSelected && styles.activeRow)}
                                role="button"
                                tabIndex={0}
                                onClick={() => onSelectMember?.(member.azure_user_id)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        onSelectMember?.(member.azure_user_id);
                                    }
                                }}
                            >
                                <td className={styles.cellAvatar}>
                                    <div className={styles.memberAvatar}>
                                        {avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt={member.display_name || "Avatar"}
                                                className={styles.memberAvatarImg}
                                            />
                                        ) : (
                                            <span className={styles.memberInitials}>
                                                {initials(member.display_name || member.email)}
                                            </span>
                                        )}
                                    </div>
                                </td>

                                <td className={styles.cellName}>
                                    <div className={styles.memberLead}>
                                        <div className={styles.memberName}>
                                            {member.display_name || "Sin nombre"}
                                        </div>
                                        <div className={styles.memberMeta}>
                                            <span className={styles.tableMuted} title={member.azure_user_id}>
                                                {member.azure_user_id}
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td className={styles.cellEmail}>
                                    <div className={styles.memberEmail}>
                                        {member.email || "Sin correo"}
                                    </div>
                                </td>

                                <td className={styles.cellState}>
                                    <Badge variant={memberStatus.variant} size="sm">
                                        {memberStatus.label}
                                    </Badge>
                                </td>

                                <td className={styles.cellNumeric}>
                                    <span className={styles.metricPill}>
                                        {formatNumber(member.teamCount || 0)}
                                    </span>
                                </td>

                                <td className={styles.cellNumeric}>
                                    <span className={styles.metricPill}>
                                        {formatNumber(member.projectCount || 0)}
                                    </span>
                                </td>

                                <td className={styles.cellDate}>
                                    <div className={styles.dateStack}>
                                        <span className={styles.datePrimary}>
                                            {formatDate(member.lastUpdatedAt)}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

