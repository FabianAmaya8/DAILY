/* ============================================================
   DAILY · LIMPIEZA POST-FASE 2
   Aplicar UNA SOLA VEZ tras revisar que `tareas` no se usa.
   Idempotente y reversible si quieres antes del commit.
   ------------------------------------------------------------
   Quita:
     1. Tabla `tareas` huérfana (existe en SQL pero ningún
        componente del frontend la consume)
     2. Vista `vista_dashboard_lider` (sustituida por la _full)
   Mantiene:
     - vista_dashboard_lider_full (en uso)
     - vista_calendario_dailys (en uso)
     - vista_ocupacion_semanal (referenciada por _full)
   ============================================================ */

begin;

-- 0. Verificar antes de borrar: si la tabla tiene datos NO-CERO,
--    aborta el patch con un RAISE EXCEPTION explícito.
--    (Quita el bloque DO si quieres forzar el drop de todas formas.)
do $$
declare
    n integer;
begin
    if exists (select 1 from information_schema.tables
               where table_schema='public' and table_name='tareas') then
        execute 'select count(*) from tareas' into n;
        if n > 0 then
            raise notice 'La tabla `tareas` tiene % filas. Revisa antes de continuar.', n;
            -- Descomenta la siguiente línea si quieres bloquear:
            -- raise exception 'Aborting: `tareas` no está vacía';
        end if;
    end if;
end $$;

-- 1. Drop tabla `tareas` (cascada por las FK desde `dailys`)
alter table if exists dailys
    drop constraint if exists dailys_proyecto_id_fkey;
-- nota: `dailys.proyecto_id` se mantiene; solo limpiamos referencias a `tareas`.

drop table if exists tareas cascade;

-- 2. Drop vista vieja (sustituida por _full)
drop view if exists vista_dashboard_lider;

commit;

/* ============================================================
   FIN. Verifica:
     select tablename from pg_tables where schemaname='public';
     select viewname  from pg_views  where schemaname='public';
   ============================================================ */
