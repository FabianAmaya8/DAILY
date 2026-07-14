import { Search } from "lucide-react";
import { Input } from "../../../ui/Input";
import { MEMBERS_PAGE_SIZE_OPTIONS, MEMBER_STATUS_OPTIONS } from "./constants";
import { formatNumber } from "./utils";
import styles from "../../../../assets/css/Admin/AzureMiembros.module.scss";

function SelectField({
    id,
    label,
    value,
    onChange,
    options,
}) {
    return (
        <div className={styles.filterField}>
            <label className={styles.fieldLabel} htmlFor={id}>
                {label}
            </label>
            <select
                id={id}
                className={styles.selectInput}
                value={value}
                onChange={(event) => onChange?.(event.target.value)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export function MembersToolbar({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    projectFilter,
    onProjectFilterChange,
    teamFilter,
    onTeamFilterChange,
    pageSize,
    onPageSizeChange,
    projectOptions = [],
    teamOptions = [],
    filteredMembersCount,
    totalMembersCount,
    currentPage,
    totalPages,
}) {
    const projectSelectOptions = [
        { value: "", label: "Todos los proyectos" },
        ...projectOptions.map((project) => ({
            value: project.azure_project_id,
            label: project.nombre || project.azure_project_id,
        })),
    ];

    const teamSelectOptions = [
        { value: "", label: "Todos los equipos" },
        ...teamOptions.map((team) => ({
            value: team.azure_team_id,
            label: team.nombre || team.azure_team_id,
        })),
    ];

    return (
        <div className={styles.toolbarPanel}>
            <div className={styles.toolbarHeader}>
                <Input
                    label="Buscar miembro"
                    placeholder="Filtrar por nombre o correo"
                    value={searchTerm}
                    onChange={(event) => onSearchChange?.(event.target.value)}
                    leftIcon={Search}
                    className={styles.searchInput}
                />

                <div className={styles.resultsMeta}>
                    <div className={styles.resultsCount}>
                        {formatNumber(filteredMembersCount)} de {formatNumber(totalMembersCount)} miembros
                    </div>
                    <div className={styles.resultsHint}>
                        Página {currentPage} de {totalPages}
                    </div>
                </div>
            </div>

            <div className={styles.filtersGrid}>
                <SelectField
                    id="azure-members-status"
                    label="Estado"
                    value={statusFilter}
                    onChange={onStatusFilterChange}
                    options={MEMBER_STATUS_OPTIONS}
                />

                <SelectField
                    id="azure-members-project"
                    label="Proyecto"
                    value={projectFilter}
                    onChange={onProjectFilterChange}
                    options={projectSelectOptions}
                />

                <SelectField
                    id="azure-members-team"
                    label="Equipo"
                    value={teamFilter}
                    onChange={onTeamFilterChange}
                    options={teamSelectOptions}
                />

                <SelectField
                    id="azure-members-page-size"
                    label="Miembros por página"
                    value={String(pageSize)}
                    onChange={(value) => onPageSizeChange?.(Number(value))}
                    options={MEMBERS_PAGE_SIZE_OPTIONS.map((size) => ({
                        value: String(size),
                        label: String(size),
                    }))}
                />
            </div>
        </div>
    );
}

