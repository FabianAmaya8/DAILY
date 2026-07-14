import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../ui/Button";
import { formatNumber, getPaginationItems } from "./utils";
import styles from "../../../../assets/css/Admin/AzureMiembros.module.scss";

export function MembersPagination({
    filteredMembersCount,
    totalMembersCount,
    currentPage,
    totalPages,
    onPrevious,
    onNext,
    onPageSelect,
}) {
    const paginationItems = getPaginationItems(currentPage, totalPages);

    return (
        <div className={styles.paginationBar}>
            <div className={styles.paginationMeta}>
                Mostrando {formatNumber(filteredMembersCount)} de {formatNumber(totalMembersCount)} miembros
            </div>

            <div className={styles.paginationControls}>
                <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={ChevronLeft}
                    onClick={onPrevious}
                    disabled={currentPage <= 1}
                >
                    Anterior
                </Button>

                <div className={styles.pageButtons} aria-label="Paginación de miembros">
                    {paginationItems.map((item) => {
                        if (typeof item !== "number") {
                            return (
                                <span key={item} className={styles.paginationEllipsis}>
                                    ...
                                </span>
                            );
                        }

                        const isActive = item === currentPage;

                        return (
                            <Button
                                key={item}
                                variant={isActive ? "primary" : "ghost"}
                                size="sm"
                                className={styles.pageButton}
                                onClick={() => onPageSelect?.(item)}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {item}
                            </Button>
                        );
                    })}
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={ChevronRight}
                    onClick={onNext}
                    disabled={currentPage >= totalPages}
                >
                    Siguiente
                </Button>
            </div>
        </div>
    );
}

