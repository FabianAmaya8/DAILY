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

export function formatNumber(value) {
    return new Intl.NumberFormat("es-CO").format(Number(value || 0));
}

export function initials(value = "") {
    const parts = String(value).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "A";

    return parts
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
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

function pick(...values) {
    return values.find(
        (value) => value !== undefined && value !== null && value !== "",
    );
}

function toText(value) {
    if (value === undefined || value === null) return null;
    const text = String(value).trim();
    return text || null;
}

export function getMemberStatus(member) {
    if (typeof member?.activo === "boolean") {
        return member.activo
            ? { label: "Activo", value: "active", variant: "success" }
            : { label: "Inactivo", value: "inactive", variant: "neutral" };
    }

    const raw = String(member?.estado || member?.status || "").trim();
    if (!raw) {
        return { label: "Sin estado", value: "unknown", variant: "neutral" };
    }

    const normalized = raw.toLowerCase();
    if (["activo", "active", "enabled"].includes(normalized)) {
        return { label: raw, value: "active", variant: "success" };
    }
    if (["inactivo", "inactive", "disabled"].includes(normalized)) {
        return { label: raw, value: "inactive", variant: "neutral" };
    }

    return { label: raw, value: "unknown", variant: "warning" };
}

function resolveTimestamp(source) {
    if (!source || typeof source !== "object") return null;

    const candidate = pick(
        source.actualizado_en,
        source.updated_at,
        source.synced_at,
        source.last_synced_at,
        source.ultima_actualizacion,
        source.modificado_en,
        source.modified_at,
        source.fecha_actualizacion,
        source.created_at,
    );

    if (!candidate) return null;

    const date = new Date(candidate);
    if (Number.isNaN(date.getTime())) return null;

    return date.toISOString();
}

export function getMemberAvatar(member) {
    return (
        member?.avatar_url ||
        member?.image_url ||
        member?.profile_url ||
        member?.photo_url ||
        null
    );
}

export function getSearchText(member) {
    return [
        member?.display_name,
        member?.nombre,
        member?.name,
        member?.email,
        member?.correo,
        member?.azure_user_id,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

export function buildAzureMemberExplorer({
    members = [],
    teams = [],
    projects = [],
    teamMembers = [],
}) {
    const projectById = new Map(
        projects
            .filter(Boolean)
            .map((project) => [project.azure_project_id, project]),
    );
    const teamById = new Map(
        teams.filter(Boolean).map((team) => [team.azure_team_id, team]),
    );

    const relationsByMemberId = new Map();
    const teamsByMemberId = new Map();
    const projectsByMemberId = new Map();

    let latestSyncedAt = null;

    const updateLatest = (value) => {
        const candidate = resolveTimestamp(value);
        if (!candidate) return;

        if (!latestSyncedAt || candidate > latestSyncedAt) {
            latestSyncedAt = candidate;
        }
    };

    members.forEach((member) => updateLatest(member));
    teams.forEach((team) => updateLatest(team));
    projects.forEach((project) => updateLatest(project));
    teamMembers.forEach((relation) => updateLatest(relation));

    teamMembers.forEach((relation) => {
        const memberId = toText(relation?.azure_user_id);
        const teamId = toText(relation?.azure_team_id);

        if (!memberId || !teamId) return;

        if (!relationsByMemberId.has(memberId)) {
            relationsByMemberId.set(memberId, []);
        }
        relationsByMemberId.get(memberId).push(relation);

        const team = teamById.get(teamId);
        if (team) {
            if (!teamsByMemberId.has(memberId)) {
                teamsByMemberId.set(memberId, new Map());
            }
            teamsByMemberId.get(memberId).set(team.azure_team_id, team);

            const projectId = toText(team.azure_project_id);
            if (projectId) {
                const project = projectById.get(projectId);
                if (project) {
                    if (!projectsByMemberId.has(memberId)) {
                        projectsByMemberId.set(memberId, new Map());
                    }
                    projectsByMemberId.get(memberId).set(project.azure_project_id, project);
                }
            }
        }
    });

    const enrichedMembers = members.map((member) => {
        const memberId = toText(member?.azure_user_id);
        const relatedTeams = Array.from(
            teamsByMemberId.get(memberId)?.values() || [],
        );
        const relatedProjects = Array.from(
            projectsByMemberId.get(memberId)?.values() || [],
        );
        const status = getMemberStatus(member);

        return {
            ...member,
            searchText: getSearchText(member),
            statusLabel: status.label,
            statusValue: status.value,
            statusVariant: status.variant,
            teamCount: relatedTeams.length,
            projectCount: relatedProjects.length,
            teamIds: relatedTeams.map((team) => team.azure_team_id),
            projectIds: relatedProjects.map((project) => project.azure_project_id),
            teams: relatedTeams,
            projects: relatedProjects,
            relations: relationsByMemberId.get(memberId) || [],
            lastUpdatedAt: resolveTimestamp(member),
            avatarUrl: getMemberAvatar(member),
        };
    });

    return {
        members: enrichedMembers,
        teamOptions: teams,
        projectOptions: projects,
        latestSyncedAt,
    };
}

