/* ============================================================
   DAILY · PATCH DE SEGURIDAD POST-AUDITORÍA
   Aplicar UNA SOLA VEZ sobre el schema actual.
   Idempotente: usa IF EXISTS / IF NOT EXISTS donde aplica.
   ------------------------------------------------------------
   Cubre los hallazgos críticos y altos del audit 2026-05:
     1. Habilita RLS en `personas` (faltaba)
     2. Restringe políticas USING (true) que exponían datos a anon
     3. Consolida políticas duplicadas en `dailys`
     4. Añade INSERT explícito a `auditoria` (más legible que confiar
        en SECURITY DEFINER implícito del trigger)
     5. Migra los campos faltantes de `certificaciones` y
        `persona_certificaciones` con ALTER TABLE
   ============================================================ */

begin;

------------------------------------------------------------
-- 1. RLS EN `personas` (CRÍTICO)
------------------------------------------------------------
alter table personas enable row level security;

-- Drop por si se aplicó parcialmente
drop policy if exists personas_select_propio on personas;
drop policy if exists personas_select_lider_admin on personas;
drop policy if exists personas_update_propio on personas;
drop policy if exists personas_admin_all on personas;
drop policy if exists personas_insert_admin on personas;

-- Cada usuario lee SU ficha
create policy personas_select_propio on personas
for select
using (id = auth.uid());

-- Líderes y admin leen toda la tabla (necesario para dashboards)
create policy personas_select_lider_admin on personas
for select
using (
    exists (
        select 1 from personas p
        where p.id = auth.uid()
          and p.rol in ('lider', 'admin')
    )
);

-- Cada usuario actualiza SU ficha PERO NO PUEDE cambiar su rol ni `activo`.
-- WITH CHECK garantiza que el row resultante mantiene rol/activo originales.
create policy personas_update_propio on personas
for update
using (id = auth.uid())
with check (
    id = auth.uid()
    and rol = (select p.rol from personas p where p.id = auth.uid())
    and activo = (select p.activo from personas p where p.id = auth.uid())
);

-- Solo admin puede crear personas y cambiar roles/activo
create policy personas_admin_all on personas
for all
using (
    exists (
        select 1 from personas p
        where p.id = auth.uid() and p.rol = 'admin'
    )
)
with check (
    exists (
        select 1 from personas p
        where p.id = auth.uid() and p.rol = 'admin'
    )
);

------------------------------------------------------------
-- 2. RESTRINGIR POLÍTICAS `USING (true)` (CRÍTICO)
--    El acceso debe requerir sesión autenticada.
------------------------------------------------------------

-- Proyectos
drop policy if exists proyectos_select on proyectos;
create policy proyectos_select on proyectos
for select
using (auth.uid() is not null);

-- Tareas
drop policy if exists tareas_select on tareas;
create policy tareas_select on tareas
for select
using (auth.uid() is not null);

-- Equivalencias de carga (catálogo, OK con auth básica)
drop policy if exists carga_select on equivalencias_carga;
create policy carga_select on equivalencias_carga
for select
using (auth.uid() is not null);

-- Certificaciones (catálogo público entre usuarios autenticados)
drop policy if exists certificaciones_select on certificaciones;
create policy certificaciones_select on certificaciones
for select
using (auth.uid() is not null);

-- Categorías de certificación
drop policy if exists categorias_select on categorias_certificacion;
create policy categorias_select on categorias_certificacion
for select
using (auth.uid() is not null);

------------------------------------------------------------
-- 3. CONSOLIDAR POLÍTICAS DUPLICADAS EN `dailys` (ALTO)
--    Antes: 3 políticas con OR implícito → ambigüedad.
--    Ahora: 1 SELECT, 1 INSERT, 1 UPDATE, 1 DELETE explícitas.
------------------------------------------------------------

drop policy if exists dailys_propios on dailys;
drop policy if exists dailys_lider_admin on dailys;
drop policy if exists dailys_full_access on dailys;

-- Lectura: el dueño + líderes/admin
create policy dailys_select on dailys
for select
using (
    persona_id = auth.uid()
    or exists (
        select 1 from personas p
        where p.id = auth.uid()
          and p.rol in ('lider', 'admin')
    )
);

-- Inserción: solo el propio usuario (un líder NO debe registrar dailys ajenos
-- desde el cliente para evitar suplantación; si necesitas eso, hazlo desde
-- una RPC/función con SECURITY DEFINER y validación explícita).
create policy dailys_insert_propio on dailys
for insert
with check (persona_id = auth.uid());

-- Actualización: dueño + líderes/admin (líder puede corregir errores)
create policy dailys_update on dailys
for update
using (
    persona_id = auth.uid()
    or exists (
        select 1 from personas p
        where p.id = auth.uid()
          and p.rol in ('lider', 'admin')
    )
)
with check (
    persona_id = auth.uid()
    or exists (
        select 1 from personas p
        where p.id = auth.uid()
          and p.rol in ('lider', 'admin')
    )
);

-- Borrado: solo admin (los dailys son evidencia auditable)
create policy dailys_delete_admin on dailys
for delete
using (
    exists (
        select 1 from personas p
        where p.id = auth.uid() and p.rol = 'admin'
    )
);

------------------------------------------------------------
-- 4. POLÍTICA `INSERT` EXPLÍCITA EN `auditoria` (ALTO)
--    El trigger SECURITY DEFINER ya inserta, pero hacerlo
--    explícito evita romperse si alguien cambia el owner.
------------------------------------------------------------

drop policy if exists auditoria_insert on auditoria;
create policy auditoria_insert on auditoria
for insert
with check (true);
-- Nota: SELECT solo admin/lider sigue como estaba.

------------------------------------------------------------
-- 5. MIGRAR CAMPOS FALTANTES en `certificaciones` y
--    `persona_certificaciones` que el segundo CREATE TABLE
--    nunca creó (porque IF NOT EXISTS hizo no-op).
------------------------------------------------------------

-- certificaciones: añadir categoria_id (FK)
alter table certificaciones
    add column if not exists categoria_id uuid
    references categorias_certificacion(id);

-- persona_certificaciones: añadir estado, validado, nivel
alter table persona_certificaciones
    add column if not exists estado text default 'pendiente';

-- Constraint con DROP+ADD para garantizar la lista permitida
alter table persona_certificaciones
    drop constraint if exists persona_certificaciones_estado_check;

alter table persona_certificaciones
    add constraint persona_certificaciones_estado_check
    check (estado in ('vigente', 'expirada', 'por_vencer', 'pendiente'));

alter table persona_certificaciones
    add column if not exists validado boolean default false;

alter table persona_certificaciones
    add column if not exists nivel text;

------------------------------------------------------------
-- 6. REVOCAR `INSERT/UPDATE/DELETE` A `anon`
--    El GRANT global del script original era demasiado amplio.
--    Mantenemos SELECT a anon (Supabase lo necesita), pero
--    revocamos el resto. RLS sigue siendo la barrera real,
--    esto es defensa en profundidad.
------------------------------------------------------------

revoke insert, update, delete on all tables in schema public from anon;

------------------------------------------------------------
-- 7. ÍNDICE PARA LA CONSULTA DE ROL (frecuente en RLS)
------------------------------------------------------------

create index if not exists idx_personas_id_rol on personas (id, rol);

------------------------------------------------------------
-- 8. VERIFICACIÓN
--    Lista tablas SIN RLS en public para auditar manualmente.
------------------------------------------------------------

-- Ejecutar manualmente después del commit:
-- select tablename
-- from pg_tables t
-- where t.schemaname = 'public'
--   and not exists (
--       select 1 from pg_class c
--       join pg_namespace n on n.oid = c.relnamespace
--       where n.nspname = 'public'
--         and c.relname = t.tablename
--         and c.relrowsecurity = true
--   );
-- Resultado esperado: 0 filas.

commit;

/* ============================================================
   FIN DEL PATCH
   Después de ejecutar:
     1. Probar login como miembro normal y verificar que solo
        puede ver SU daily y NO puede cambiar su `rol`.
     2. Probar como líder y verificar acceso a vistas dashboard.
     3. Probar la inserción de un daily y confirmar que el
        registro de auditoría se crea correctamente.
   ============================================================ */
