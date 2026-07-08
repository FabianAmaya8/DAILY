import { useMemo, useState } from "react";
import {
    DatabaseZap,
    FolderKanban,
    RefreshCcw,
    Search,
} from "lucide-react";
import { Button } from "../../../ui/Button";
import { Card } from "../../../ui/Card";
import { EmptyState } from "../../../ui/EmptyState";
import styles from "../../../../assets/css/Admin/DatosAzure.module.scss";
import { ProjectDetailsModal } from "./ProjectDetailsModal";
import { ProjectsPagination } from "./ProjectsPagination";
import { ProjectsTable } from "./ProjectsTable";
import { ProjectsToolbar } from "./ProjectsToolbar";
import { SummaryCards } from "./SummaryCards";
import { SyncErrors } from "./SyncErrors";
import { formatDate, groupBy } from "./utils";

export default function Datos({
    projects = [],
    teams = [],
    members = [],
    teamMembers = [],
    dataLoading = false,
    dataError = null,
    onRefreshData,
    lastLoadedAt = null,
    selectedProjectId = "",
    onSelectProject,
    selectedTeamId = "",
    onSelectTeam,
    syncAllLoading = false,
    syncAllError = null,
    onSyncAll,
    syncProjectLoading = false,
    syncProjectError = null,
    onSyncProject,
    selectedProject = null,
    selectedTeam = null,
    selectedProjectStats = { teamCount: 0, memberCount: 0 },
    selectedTeamMembers = [],
    selectedProjectTeams = [],
    syncSummary = {
        projects: 0,
        teams: 0,
        members: 0,
        teamMembers: 0,
        errors: [],
    },
}) {
    const teamRelationsMap = useMemo(() => groupBy(teamMembers, "azure_team_id"), [teamMembers]);
    const [searchTerm, setSearchTerm] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);

    const filteredProjects = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        if (!normalizedSearch) {
            return projects;
        }

        return projects.filter((project) =>
            String(project.nombre || "")
                .toLowerCase()
                .includes(normalizedSearch),
        );
    }, [projects, searchTerm]);

    const totalProjects = projects.length;
    const filteredProjectsCount = filteredProjects.length;
    const totalPages = Math.max(1, Math.ceil(filteredProjectsCount / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedProjects = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * pageSize;
        return filteredProjects.slice(startIndex, startIndex + pageSize);
    }, [filteredProjects, pageSize, safeCurrentPage]);

    const handleSelectProject = (projectId) => {
        onSelectProject?.(projectId);
        setIsProjectDetailsOpen(true);
    };

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>
                        <DatabaseZap size={20} aria-hidden="true" />
                        Azure DevOps
                    </h1>
                    <p className={styles.subtitle}>
                        Panel de consulta desde Supabase con proyectos, equipos y miembros sincronizados.
                    </p>
                </div>

                <div className={styles.headerActions}>
                    <Button
                        variant="primary"
                        leftIcon={RefreshCcw}
                        loading={syncAllLoading}
                        onClick={() => onSyncAll?.()}
                    >
                        Sincronizar todo
                    </Button>
                    <Button
                        variant="ghost"
                        leftIcon={RefreshCcw}
                        loading={syncProjectLoading}
                        onClick={() => onSyncProject?.()}
                        disabled={!selectedProject}
                    >
                        Sincronizar proyecto
                    </Button>
                </div>
            </header>

            <SummaryCards
                projectsCount={projects.length}
                teamsCount={teams.length}
                membersCount={members.length}
                teamMembersCount={teamMembers.length}
                lastLoadedAt={lastLoadedAt}
                dataLoading={dataLoading}
                syncErrorsCount={syncSummary.errors?.length || 0}
            />

            <SyncErrors
                syncAllError={syncAllError}
                syncProjectError={syncProjectError}
                syncSummaryErrors={syncSummary.errors || []}
            />

            <div className={styles.Proyectos}>
                <Card
                    title="Proyectos"
                    description="Información leída únicamente desde ado_projects."
                    padding="sm"
                    footer={
                        <div className={styles.cardFooter}>
                            {dataError ? (
                                <span className={styles.errorText}>{dataError}</span>
                            ) : (
                                <span className={styles.footerMeta}>
                                    Última carga: {formatDate(lastLoadedAt)}
                                </span>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={RefreshCcw}
                                loading={dataLoading}
                                onClick={() => onRefreshData?.()}
                            >
                                Refrescar datos
                            </Button>
                        </div>
                    }
                >
                    {projects.length === 0 ? (
                        <EmptyState
                            icon={FolderKanban}
                            title="No hay proyectos cargados"
                            description="Abre la página para leer los registros almacenados en Supabase."
                        />
                    ) : filteredProjectsCount === 0 ? (
                        <div className={styles.emptyWrapper}>
                            <EmptyState
                                icon={Search}
                                title="Sin resultados"
                                description="Ajusta el texto de búsqueda para encontrar proyectos por nombre."
                            />
                        </div>
                    ) : (
                        <div className={styles.projectsPanel}>
                            <ProjectsToolbar
                                searchTerm={searchTerm}
                                onSearchChange={(value) => {
                                    setSearchTerm(value);
                                    setCurrentPage(1);
                                }}
                                pageSize={pageSize}
                                onPageSizeChange={(value) => {
                                    setPageSize(value);
                                    setCurrentPage(1);
                                }}
                                filteredProjectsCount={filteredProjectsCount}
                                totalProjects={totalProjects}
                                currentPage={safeCurrentPage}
                                totalPages={totalPages}
                            />

                            <ProjectsTable
                                projects={paginatedProjects}
                                selectedProjectId={selectedProjectId}
                                onSelectProject={handleSelectProject}
                            />

                            <ProjectsPagination
                                filteredProjectsCount={filteredProjectsCount}
                                totalProjects={totalProjects}
                                currentPage={safeCurrentPage}
                                totalPages={totalPages}
                                onPrevious={() => setCurrentPage((value) => Math.max(1, value - 1))}
                                onNext={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
                                onPageSelect={setCurrentPage}
                            />
                        </div>
                    )}
                </Card>
            </div>

            <ProjectDetailsModal
                open={isProjectDetailsOpen}
                onClose={() => setIsProjectDetailsOpen(false)}
                project={selectedProject}
                projectStats={selectedProjectStats}
                selectedTeamId={selectedTeamId}
                onSelectTeam={onSelectTeam}
                selectedProjectTeams={selectedProjectTeams}
                selectedTeam={selectedTeam}
                selectedTeamMembers={selectedTeamMembers}
                getTeamMemberCount={(teamId) => (teamRelationsMap[teamId] || []).length}
            />
        </div>
    );
}
