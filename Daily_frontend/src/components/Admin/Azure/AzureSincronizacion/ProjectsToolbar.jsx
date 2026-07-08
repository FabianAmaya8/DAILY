import { Search } from "lucide-react";
import { Input } from "../../../ui/Input";
import { formatNumber } from "./utils";
import styles from "../../../../assets/css/Admin/DatosAzure.module.scss";

export function ProjectsToolbar({
    searchTerm,
    onSearchChange,
    pageSize,
    onPageSizeChange,
    filteredProjectsCount,
    totalProjects,
    currentPage,
    totalPages,
}) {
    return (
        <div className={styles.tableToolbar}>
            <Input
                label="Buscar proyecto"
                placeholder="Filtrar por nombre"
                value={searchTerm}
                onChange={(event) => onSearchChange?.(event.target.value)}
                leftIcon={Search}
                className={styles.searchInput}
            />

            <div className={styles.filtersBar}>
                <div className={styles.pageSizeField}>
                    <label className={styles.pageSizeLabel} htmlFor="azure-projects-page-size">
                        Proyectos por página
                    </label>
                    <select
                        id="azure-projects-page-size"
                        className={styles.pageSizeSelect}
                        value={pageSize}
                        onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                <div className={styles.resultsMeta}>
                    <div className={styles.resultsCount}>
                        {formatNumber(filteredProjectsCount)} de {formatNumber(totalProjects)} proyectos
                    </div>
                    <div className={styles.resultsHint}>
                        Página {currentPage} de {totalPages}
                    </div>
                </div>
            </div>
        </div>
    );
}
