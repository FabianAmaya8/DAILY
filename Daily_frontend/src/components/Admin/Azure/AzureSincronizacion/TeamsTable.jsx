import clsx from "clsx";
import {FolderKanban,UsersRound} from "lucide-react";
import {EmptyState} from "../../../ui/EmptyState";
import {formatNumber} from "./utils";
import styles from "../../../../assets/css/Admin/DatosAzure.module.scss";

export function TeamsTable({
    selectedProject,
    selectedProjectTeams,
    selectedTeamId,
    onSelectTeam,
    getTeamMemberCount,
}) {
    if (!selectedProject) {
        return (
            <EmptyState
                icon={UsersRound}
                title="Selecciona un proyecto"
                description="La información de equipos depende del proyecto activo."
            />
        );
    }

    if (selectedProjectTeams.length === 0) {
        return (
            <EmptyState
                icon={UsersRound}
                title="Este proyecto no tiene equipos"
                description="La tabla ado_teams no tiene registros asociados para el proyecto seleccionado."
            />
        );
    }

    return (
        <div className={clsx(styles.tableContainer,styles.projectsTableContainer)}>
            <table className={clsx(styles.table,styles.projectsTable)}>
                <colgroup>
                    <col style={{width:"52%"}}/>
                    <col style={{width:"33%"}}/>
                    <col style={{width:"15%"}}/>
                </colgroup>

                <thead>
                    <tr>
                        <th className={styles.thName}>Equipo</th>
                        <th>Descripción</th>
                        <th className={styles.thMembers}>Miembros</th>
                    </tr>
                </thead>

                <tbody>

                    {selectedProjectTeams.map((team)=>{

                        const isSelected=team.azure_team_id===selectedTeamId;
                        const memberCount=getTeamMemberCount?.(team.azure_team_id)||0;

                        return(

                            <tr
                                key={team.azure_team_id}
                                className={clsx(styles.projectRow,isSelected&&styles.activeRow)}
                                onClick={()=>onSelectTeam?.(team.azure_team_id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e)=>{
                                    if(e.key==="Enter"||e.key===" "){
                                        e.preventDefault();
                                        onSelectTeam?.(team.azure_team_id);
                                    }
                                }}
                            >

                                <td className={styles.cellName}>

                                    <div className={styles.projectLead}>

                                        <div className={styles.projectIcon}>
                                            <FolderKanban size={15}/>
                                        </div>

                                        <div className={styles.projectText}>

                                            <div
                                                className={styles.projectName}
                                                title={team.nombre}
                                            >
                                                {team.nombre}
                                            </div>

                                            <div
                                                className={styles.projectId}
                                                title={team.azure_team_id}
                                            >
                                                {team.azure_team_id}
                                            </div>

                                        </div>

                                    </div>

                                </td>

                                <td className={styles.cellTruncate}>

                                    {team.descripcion?(
                                        <span
                                            className={styles.tableMuted}
                                            title={team.descripcion}
                                        >
                                            {team.descripcion}
                                        </span>
                                    ):(
                                        <span className={styles.tableMuted}>
                                            Sin descripción
                                        </span>
                                    )}

                                </td>

                                <td className={styles.cellNumeric}>

                                    <span
                                        className={styles.metricPill}
                                        title={`${memberCount} miembros`}
                                    >
                                        {formatNumber(memberCount)}
                                    </span>

                                </td>

                            </tr>

                        );

                    })}

                </tbody>

            </table>
        </div>
    );
}