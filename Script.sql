/* ============================================================
   SISTEMA DE VISIBILIDAD DE DAILYS, OCUPACIÓN Y RIESGOS
   VERSIÓN FINAL LIMPIA
   ============================================================ */

create extension if not exists pgcrypto;

---------------------------------------------------------------
-- LIMPIEZA GLOBAL DE POLÍTICAS (IMPORTANTE)
---------------------------------------------------------------
do $$
declare
    r record;
begin
    for r in
        select schemaname, tablename, policyname
        from pg_policies
        where schemaname = 'public'
    loop
        execute format(
            'drop policy if exists %I on %I.%I;',
            r.policyname,
            r.schemaname,
            r.tablename
        );
    end loop;
end $$;

---------------------------------------------------------------
-- TABLA PERSONAS
---------------------------------------------------------------
create table if not exists personas (
  id uuid primary key,
  nombre text not null,
  correo text not null unique,
  rol text not null check (rol in ('miembro','lider','admin')),
  activo boolean default true,
  capacidad_horas_semana numeric default 40,
  zona_horaria text default 'America/Bogota',
  creado_en timestamptz default now()
);

---------------------------------------------------------------
-- TABLA EQUIPOS
---------------------------------------------------------------
create table if not exists equipos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  descripcion text,
  lider_id uuid references personas(id),
  creado_en timestamptz default now()
);

---------------------------------------------------------------
-- MIEMBROS DE EQUIPO
---------------------------------------------------------------
create table if not exists miembros_equipo (
  id uuid primary key default gen_random_uuid(),
  equipo_id uuid references equipos(id) on delete cascade,
  persona_id uuid references personas(id) on delete cascade,
  rol text default 'miembro',
  fecha_ingreso timestamptz default now(),
  unique(equipo_id, persona_id)
);

---------------------------------------------------------------
-- PROYECTOS
---------------------------------------------------------------
create table if not exists proyectos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  cliente_area text,
  tipo text,
  estado text default 'Activo',
  prioridad text default 'Media',
  lider_proyecto_id uuid references personas(id),
  creado_en timestamptz default now()
);

---------------------------------------------------------------
-- TAREAS (WORK ITEMS)
---------------------------------------------------------------
create table if not exists tareas (
  id uuid primary key default gen_random_uuid(),
  fuente text not null,
  id_externo text not null,
  titulo text not null,
  tipo text,
  estado text,
  estado_canonico text,
  prioridad text,
  asignado_a uuid references personas(id),
  proyecto_id uuid references proyectos(id),
  tipo_estimacion text,
  valor_estimacion numeric,
  iteracion text,
  etiquetas text,
  url text,
  fecha_cambio timestamptz,
  actualizado_en timestamptz default now(),
  unique(fuente, id_externo)
);

---------------------------------------------------------------
-- DAILYS
---------------------------------------------------------------
create table if not exists dailys (
  id uuid primary key default gen_random_uuid(),
  fecha date not null,
  persona_id uuid not null references personas(id) on delete cascade,
  equipo_id uuid references equipos(id),
  proyecto_id uuid references proyectos(id),
  que_hice_ayer text,
  que_hare_hoy text,
  bloqueos_texto text,
  modelo_carga text check (modelo_carga in ('tshirt','puntos','porcentaje')),
  valor_carga text,
  confianza text,
  fuente text,
  creado_en timestamptz default now(),
  actualizado_en timestamptz default now(),
  unique(persona_id, fecha)
);

---------------------------------------------------------------
-- BLOQUEOS
---------------------------------------------------------------
create table if not exists bloqueos (
  id uuid primary key default gen_random_uuid(),
  daily_id uuid references dailys(id) on delete cascade,
  proyecto_id uuid references proyectos(id),
  persona_id uuid references personas(id),
  tipo text,
  severidad text,
  responsable_id uuid references personas(id),
  fecha_limite date,
  estado text default 'Abierto',
  notas text,
  creado_en timestamptz default now()
);

---------------------------------------------------------------
-- EQUIVALENCIAS DE CARGA
---------------------------------------------------------------
create table if not exists equivalencias_carga (
  id uuid primary key default gen_random_uuid(),
  modelo text not null,
  valor text not null,
  horas_equivalentes numeric not null,
  activo boolean default true,
  unique(modelo,valor)
);

---------------------------------------------------------------
-- AUDITORÍA (TE FALTABA ⚠️)
---------------------------------------------------------------
create table if not exists auditoria (
  id uuid primary key default gen_random_uuid(),
  entidad text,
  entidad_id uuid,
  accion text,
  actor_id uuid,
  datos_antes jsonb,
  datos_despues jsonb,
  creado_en timestamptz default now()
);

-- FK PARA RELACIÓN CON PERSONAS
alter table auditoria
add constraint if not exists auditoria_actor_id_fkey
foreign key (actor_id) references personas(id)
on delete set null;

---------------------------------------------------------------
-- ÍNDICES (RENDIMIENTO)
---------------------------------------------------------------
create index if not exists idx_dailys_fecha on dailys(fecha);
create index if not exists idx_tareas_proyecto_estado on tareas(proyecto_id, estado_canonico);
create index if not exists idx_bloqueos_estado_fecha on bloqueos(estado, fecha_limite);

---------------------------------------------------------------
-- ACTIVAR RLS
---------------------------------------------------------------
alter table equipos enable row level security;
alter table miembros_equipo enable row level security;
alter table dailys enable row level security;
alter table bloqueos enable row level security;
alter table proyectos enable row level security;
alter table tareas enable row level security;
alter table equivalencias_carga enable row level security;
alter table auditoria enable row level security;

---------------------------------------------------------------
-- POLÍTICAS EQUIPOS
---------------------------------------------------------------
create policy equipos_admin on equipos
for all using (
  exists (select 1 from personas where id = auth.uid() and rol = 'admin')
);

create policy equipos_lider on equipos
for select using (lider_id = auth.uid());

create policy equipos_insert on equipos
for insert with check (
  exists (select 1 from personas where id = auth.uid() and rol in ('admin','lider'))
);

---------------------------------------------------------------
-- MIEMBROS
---------------------------------------------------------------
create policy miembros_select on miembros_equipo
for select using (
  persona_id = auth.uid()
  OR exists (select 1 from personas where id = auth.uid() and rol in ('admin','lider'))
);

create policy miembros_insert on miembros_equipo
for insert with check (
  exists (select 1 from equipos where id = equipo_id and lider_id = auth.uid())
  OR exists (select 1 from personas where id = auth.uid() and rol = 'admin')
);

create policy miembros_delete on miembros_equipo
for delete using (
  exists (select 1 from equipos where id = equipo_id and lider_id = auth.uid())
  OR exists (select 1 from personas where id = auth.uid() and rol = 'admin')
);

---------------------------------------------------------------
-- DAILYS
---------------------------------------------------------------
create policy dailys_propios on dailys
for all using (persona_id = auth.uid());

create policy dailys_lider_admin on dailys
for select using (
  exists (select 1 from personas where id = auth.uid() and rol in ('lider','admin'))
);

---------------------------------------------------------------
-- BLOQUEOS
---------------------------------------------------------------
create policy bloqueos_propios on bloqueos
for select using (persona_id = auth.uid());

create policy bloqueos_insert on bloqueos
for insert with check (persona_id = auth.uid());

create policy bloqueos_lider_admin on bloqueos
for all using (
  exists (select 1 from personas where id = auth.uid() and rol in ('lider','admin'))
);

---------------------------------------------------------------
-- PROYECTOS
---------------------------------------------------------------
create policy proyectos_select on proyectos
for select using (true);

create policy proyectos_admin on proyectos
for all using (
  exists (select 1 from personas where id = auth.uid() and rol = 'admin')
);

---------------------------------------------------------------
-- TAREAS
---------------------------------------------------------------
create policy tareas_select on tareas
for select using (true);

create policy tareas_admin on tareas
for all using (
  exists (select 1 from personas where id = auth.uid() and rol = 'admin')
);

---------------------------------------------------------------
-- CARGA
---------------------------------------------------------------
create policy carga_select on equivalencias_carga
for select using (true);

create policy carga_admin on equivalencias_carga
for all using (
  exists (select 1 from personas where id = auth.uid() and rol = 'admin')
);

---------------------------------------------------------------
-- AUDITORÍA TRIGGER
---------------------------------------------------------------
create or replace function registrar_auditoria()
returns trigger
language plpgsql
security definer
as $$
declare actor uuid;
begin
  actor := auth.uid();

  if (TG_OP = 'INSERT') then
    insert into auditoria(entidad, entidad_id, accion, actor_id, datos_despues)
    values (TG_TABLE_NAME, NEW.id, 'INSERT', actor, to_jsonb(NEW));
    return NEW;

  elsif (TG_OP = 'UPDATE') then
    insert into auditoria(entidad, entidad_id, accion, actor_id, datos_antes, datos_despues)
    values (TG_TABLE_NAME, NEW.id, 'UPDATE', actor, to_jsonb(OLD), to_jsonb(NEW));
    return NEW;

  elsif (TG_OP = 'DELETE') then
    insert into auditoria(entidad, entidad_id, accion, actor_id, datos_antes)
    values (TG_TABLE_NAME, OLD.id, 'DELETE', actor, to_jsonb(OLD));
    return OLD;
  end if;
end;
$$;

---------------------------------------------------------------
-- TRIGGERS (FIX ERROR RE-EJECUCIÓN)
---------------------------------------------------------------

drop trigger if exists auditoria_equipos on equipos;
drop trigger if exists auditoria_dailys on dailys;
drop trigger if exists auditoria_bloqueos on bloqueos;

create trigger auditoria_equipos 
after insert or update or delete on equipos
for each row execute function registrar_auditoria();

create trigger auditoria_dailys 
after insert or update or delete on dailys
for each row execute function registrar_auditoria();

create trigger auditoria_bloqueos 
after insert or update or delete on bloqueos
for each row execute function registrar_auditoria();

---------------------------------------------------------------
-- AUDITORÍA
---------------------------------------------------------------

create policy auditoria_select on auditoria
for select using (
  exists (
    select 1 
    from personas 
    where id = auth.uid() 
    and rol in ('admin','lider')
  )
);

---------------------------------------------------------------
-- DATOS INICIALES
---------------------------------------------------------------
insert into equivalencias_carga(modelo,valor,horas_equivalentes)
values
('tshirt','S',4),
('tshirt','M',6),
('tshirt','L',8),
('tshirt','XL',10)
on conflict do nothing;

/* ============================================================
   MEJORAS PARA DASHBOARD LÍDER Y VISIBILIDAD
   ============================================================ */

---------------------------------------------------------------
-- 1. PROYECTO PRINCIPAL EN PERSONAS
---------------------------------------------------------------
alter table personas
add column if not exists proyecto_principal_id uuid
references proyectos(id);

---------------------------------------------------------------
-- 2. ÍNDICE CLAVE PARA CALENDARIO
---------------------------------------------------------------
create index if not exists idx_dailys_persona_fecha
on dailys(persona_id, fecha desc);

---------------------------------------------------------------
-- 3. VISTA OCUPACIÓN SEMANAL
---------------------------------------------------------------
create or replace view vista_ocupacion_semanal as
select
  p.id as persona_id,
  p.nombre,

  coalesce(sum(ec.horas_equivalentes),0) as horas_asignadas,

  p.capacidad_horas_semana,

  case 
    when p.capacidad_horas_semana > 0 then
      round(
        (coalesce(sum(ec.horas_equivalentes),0) / p.capacidad_horas_semana) * 100
      ,2)
    else 0
  end as ocupacion_porcentaje

from personas p
left join dailys d 
  on d.persona_id = p.id
  and date_trunc('week', d.fecha) = date_trunc('week', now())

left join equivalencias_carga ec
  on ec.modelo = d.modelo_carga
  and ec.valor = d.valor_carga

group by p.id;

---------------------------------------------------------------
-- 4. VISTA DASHBOARD LÍDER (🔥 PRINCIPAL)
---------------------------------------------------------------
create or replace view vista_dashboard_lider as
select
  p.id,
  p.nombre,
  p.correo,
  p.rol,
  p.activo,

  pr.nombre as proyecto,

  d.fecha as ultima_fecha,
  d.que_hice_ayer,
  d.que_hare_hoy,
  d.bloqueos_texto,

  vo.ocupacion_porcentaje

from personas p

left join proyectos pr
  on pr.id = p.proyecto_principal_id

-- Último daily por persona
left join lateral (
  select *
  from dailys d
  where d.persona_id = p.id
  order by d.fecha desc
  limit 1
) d on true

left join vista_ocupacion_semanal vo
  on vo.persona_id = p.id;

---------------------------------------------------------------
-- 5. VISTA CALENDARIO DAILYS (opcional pero PRO)
---------------------------------------------------------------
create or replace view vista_calendario_dailys as
select
  d.id,
  d.fecha,
  d.persona_id,
  p.nombre,
  d.proyecto_id,
  pr.nombre as proyecto,
  d.que_hice_ayer,
  d.que_hare_hoy,
  d.bloqueos_texto
from dailys d
join personas p on p.id = d.persona_id
left join proyectos pr on pr.id = d.proyecto_id;

-- 🔥 FIX GLOBAL SUPABASE
grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on all tables in schema public 
to anon, authenticated;

alter default privileges in schema public
grant select, insert, update, delete on tables 
to anon, authenticated;