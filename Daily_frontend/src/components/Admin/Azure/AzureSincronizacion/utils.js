import { PROJECT_STATUS_VARIANT } from "./constants";

export function getProjectStatusVariant(status) {
    const normalized = String(status || "").trim().toLowerCase();
    return PROJECT_STATUS_VARIANT[normalized] || "info";
}

export function getMemberStatus(member) {
    if (typeof member?.activo === "boolean") {
        return member.activo ? { label: "Activo", variant: "success" } : { label: "Inactivo", variant: "neutral" };
    }

    const raw = String(member?.estado || member?.status || "").trim();
    if (!raw) return { label: "Sin estado", variant: "neutral" };

    const normalized = raw.toLowerCase();
    if (["activo", "active", "enabled"].includes(normalized)) {
        return { label: raw, variant: "success" };
    }
    if (["inactivo", "inactive", "disabled"].includes(normalized)) {
        return { label: raw, variant: "neutral" };
    }
    return { label: raw, variant: "warning" };
}

export function formatDate(value) {
    if (!value) return "Sin datos";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Sin datos";

    return new Intl.DateTimeFormat("es-CO", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export function formatDateOnly(value) {
    if (!value) return "Sin datos";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Sin datos";

    return new Intl.DateTimeFormat("es-CO", {
        dateStyle: "medium",
    }).format(date);
}

export function formatHour(value) {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("es-CO", {
        timeStyle: "short",
    }).format(date);
}

export function formatNumber(value) {
    return new Intl.NumberFormat("es-CO").format(Number(value || 0));
}

export function groupBy(items, key) {
    return items.reduce((acc, item) => {
        const groupKey = item?.[key] || "";
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
    }, {});
}

export function initials(value = "") {
    const parts = String(value).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "A";
    return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function getVisibilityVariant(value) {
    const normalized = String(value || "").trim().toLowerCase();

    if (["public", "público", "publico"].includes(normalized)) {
        return "success";
    }

    if (["private", "privado"].includes(normalized)) {
        return "neutral";
    }

    return "info";
}

export function getPaginationItems(currentPage, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const items = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) items.push("ellipsis-start");

    for (let page = start; page <= end; page += 1) {
        items.push(page);
    }

    if (end < totalPages - 1) items.push("ellipsis-end");

    items.push(totalPages);
    return items;
}
