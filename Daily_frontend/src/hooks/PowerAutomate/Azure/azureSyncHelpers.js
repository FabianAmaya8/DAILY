export function getFlowItems(payload) {
    if (Array.isArray(payload)) return payload;

    return (
        payload?.value ||
        payload?.projects ||
        payload?.items ||
        payload?.data ||
        payload?.result ||
        payload?.records ||
        []
    );
}

export function getFlowPayload(payload) {
    return payload?.data ?? payload ?? {};
}

function pick(...values) {
    return values.find(
        (value) => value !== undefined && value !== null && value !== "",
    );
}

function toText(value) {
    if (value === undefined || value === null) return null;
    return String(value).trim() || null;
}

export function normalizeAzureProject(item) {
    if (!item) return null;

    const azureProjectId = toText(
        pick(
            item.azure_project_id,
            item.project_id,
            item.projectId,
            item.id,
        ),
    );

    if (!azureProjectId) return null;

    return {
        azure_project_id: azureProjectId,
        nombre: pick(item.nombre, item.name, item.project_name, item.title) || azureProjectId,
        url: toText(item.url),
        estado: toText(pick(item.estado, item.state, item.status)),
        revision: item.revision ?? null,
        visibilidad: toText(pick(item.visibilidad, item.visibility)),
        ultima_actualizacion: toText(
            pick(item.ultima_actualizacion, item.lastUpdateTime),
        ),
        activo: true,
        actualizado_en: new Date().toISOString(),
    };
}

export function normalizeAzureTeam(item, projectId) {
    if (!item) return null;

    const azureTeamId = toText(
        pick(item.azure_team_id, item.teamId, item.id, item.identifier),
    );

    if (!azureTeamId) return null;

    return {
        azure_team_id: azureTeamId,
        azure_project_id: toText(projectId || item.azure_project_id || item.projectId),
        nombre: pick(item.nombre, item.name, item.teamName, item.displayName) || azureTeamId,
        descripcion: toText(pick(item.descripcion, item.description)),
        url: toText(item.url),
        identity_url: toText(pick(item.identity_url, item.identityUrl)),
        activo: true,
        actualizado_en: new Date().toISOString(),
    };
}

export function normalizeAzureMember(item) {
    if (!item) return null;

    const azureUserId = toText(
        pick(item.azure_user_id, item.userId, item.id, item.descriptor),
    );

    if (!azureUserId) return null;

    return {
        azure_user_id: azureUserId,
        display_name: toText(
            pick(item.display_name, item.displayName, item.name),
        ),
        email: toText(pick(item.email, item.uniqueName, item.mail, item.principalName)),
        descriptor: toText(item.descriptor),
        profile_url: toText(pick(item.profile_url, item.profileUrl)),
        image_url: toText(pick(item.image_url, item.imageUrl)),
        avatar_url: toText(pick(item.avatar_url, item.avatarUrl)),
        activo: true,
        actualizado_en: new Date().toISOString(),
    };
}

export function normalizeAzureTeamMember(item) {
    if (!item) return null;

    const azureTeamId = toText(
        pick(item.azure_team_id, item.teamId, item.team_id, item.groupId),
    );
    const azureUserId = toText(
        pick(item.azure_user_id, item.userId, item.memberId, item.personId),
    );

    if (!azureTeamId || !azureUserId) return null;

    return {
        azure_team_id: azureTeamId,
        azure_user_id: azureUserId,
    };
}

export function collectProjectDetailRows(detailPayload, projectId) {
    const payload = getFlowPayload(detailPayload);
    const teams = getFlowItems(payload.teams).map((item) =>
        normalizeAzureTeam(item, projectId),
    );
    const members = getFlowItems(payload.members).map(normalizeAzureMember);
    const teamMembers = getFlowItems(payload.teamMembers).map(
        normalizeAzureTeamMember,
    );

    return {
        teams: teams.filter(Boolean),
        members: members.filter(Boolean),
        teamMembers: teamMembers.filter(Boolean),
        raw: payload,
    };
}
