# DAILY · Design System v2

Sistema de diseño del producto **DAILY — Sistema de Visibilidad**.
Estética: **Linear / Vercel** (oscuro denso, técnico, jerarquía clara, acento verde marca).

---

## 1. Filosofía

| Principio | Aplicación |
|---|---|
| **Densidad sobre adorno** | Tipografía 13–15px en interfaces, no 16+. Espaciado calibrado. |
| **Jerarquía por tipografía y color, no por bordes pesados** | Bordes 1px sutiles, sombras suaves. |
| **Verde como acento, no como fondo** | Verde DAILY (`#3fb950`) reservado a CTA, branding, status success. |
| **Animaciones discretas** | 120–320 ms con `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out natural). |
| **Accesibilidad por defecto** | `:focus-visible` con anillo de 4px, soporte `prefers-reduced-motion`. |

---

## 2. Tokens (CSS variables)

Definidos en [`src/assets/css/Global.scss`](./src/assets/css/Global.scss).

### 2.1 Color · tema oscuro (default)

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#0a0d12` | Fondo de página |
| `--color-bg-secondary` | `#11151c` | Cards, panels |
| `--color-bg-tertiary` | `#161b24` | Headers de tabla, sub-paneles |
| `--color-bg-elevated` | `#1a212c` | Hover de cards, modales |
| `--color-text-primary` | `#e6edf3` | Títulos y cuerpo principal |
| `--color-text-secondary` | `#b1bac4` | Texto de apoyo |
| `--color-text-muted` | `#7d8590` | Etiquetas, hints |
| `--color-primary` | `#3fb950` | Marca / CTA / success |
| `--color-secondary` | `#58a6ff` | Acento azul (info, links) |
| `--color-warning` | `#d29922` | Avisos |
| `--color-danger` | `#f85149` | Errores destructivos |
| `--color-border` | `#262d36` | Bordes default |
| `--color-border-strong` | `#353d48` | Hover de inputs |

### 2.2 Color · tema claro

Mismas claves, valores adaptados a alto contraste sobre blanco. Activación: `<body data-theme="claro">`.

### 2.3 Tipografía

```
--font-family-sans: "Inter", ui-sans-serif, system-ui, ...
--font-family-mono: ui-monospace, "SF Mono", "JetBrains Mono", ...
```

Escala modular (ratio 1.125):

| Token | Tamaño | Uso |
|---|---|---|
| `--font-2xs` | 11 px | Labels, kbd, badges |
| `--font-xs` | 12 px | Texto secundario, hints |
| `--font-sm` | 13 px | Texto en tablas, formularios |
| `--font-md` | 15 px | Cuerpo principal |
| `--font-lg` | 17 px | Subhero, títulos card |
| `--font-xl` | 20 px | Section title |
| `--font-2xl` | 24 px | Page title |
| `--font-3xl` | 32 px | Hero S |
| `--font-4xl` | 42 px | Hero M |
| `--font-5xl` | 56 px | Hero XL |

Pesos: 400, 500, 600, 700.
Tracking: `--tracking-tight (-0.02em)` en títulos, normal en cuerpo.

### 2.4 Espaciado (escala 4px)

`--space-xxs (4)` · `--space-xs (8)` · `--space-sm (12)` · `--space-md (16)` · `--space-lg (24)` · `--space-xl (32)` · `--space-2xl (48)` · `--space-3xl (72)` · `--space-4xl (96)`.

### 2.5 Radio

`--radius-xs (4)` · `--radius-sm (6)` · `--radius-md (8)` · `--radius-lg (12)` · `--radius-xl (16)` · `--radius-2xl (24)` · `--radius-full (9999)`.

### 2.6 Sombras (oscuro tiene opacidad mayor)

`--shadow-xs` · `--shadow-sm` · `--shadow-md` · `--shadow-lg` · `--shadow-xl` · `--glow-primary` (verde con blur, para hover de CTA).

### 2.7 Motion

| Token | Valor |
|---|---|
| `--motion-fast` | 120 ms |
| `--motion-base` | 200 ms |
| `--motion-slow` | 320 ms |
| `--motion-slower` | 480 ms |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

### 2.8 Z-index escalado

`--z-base (1)` · `--z-dropdown (50)` · `--z-sticky (75)` · `--z-overlay (90)` · `--z-modal (100)` · `--z-popover (150)` · `--z-toast (200)` · `--z-tooltip (300)`.

---

## 3. Patrones de componente

### 3.1 Botones

```jsx
// Primario
<button className="btnPrimary">Acción <ArrowRight size={16}/></button>

// Ghost (secundario)
<button className="btnGhost">Cancelar</button>
```

Reglas:
- Primario: `var(--color-primary)`, hover `var(--color-primary-hover)` + `--glow-primary`.
- Ghost: transparente, borde `--color-border-strong`, texto `--color-text-secondary`.
- Padding interno mínimo: `12px 22px` para CTA, `8px 16px` para acciones secundarias.
- Iconos `lucide-react` a 16 px en CTA, 14 px en acciones inline.

### 3.2 Inputs

- Padding: `11px 14px`.
- Borde 1 px, hover sube a `--color-input-border-hover`.
- Focus: anillo `0 0 0 3px var(--color-primary-soft)` y borde primary.
- Placeholder con `--color-input-placeholder` (sutil).
- Siempre con `<label htmlFor="...">` asociado.
- `autoComplete` correcto (`email`, `current-password`, `new-password`, etc.).

### 3.3 Cards

- Fondo `--color-bg-secondary`, borde `--color-border`, radio `--radius-lg`.
- Hover sutil: borde a `--color-primary-border`, `translateY(-2px)`.

### 3.4 Modal

- Overlay `var(--color-overlay)` (rgba con 0.72).
- Card centrada con `--radius-xl`, padding `--space-xl`.
- Cierre con click fuera + tecla Escape (recomendado para futuros modales).

### 3.5 Tablas

- Header: tipografía `--font-xs`, mayúsculas, `tracking-wide`, color `--color-text-muted`.
- Filas: hover `--color-table-row-hover`.
- Bordes solo en `border-bottom` (no laterales).

---

## 4. Animación reveal-on-scroll

Pattern usado en la landing (sin librerías):

```jsx
useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("is-visible");
                observer.unobserve(e.target);
            }
        }),
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
}, []);
```

CSS:
```css
.reveal { opacity: 0; transform: translateY(16px); transition: ... }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: 80ms; }
```

Respeta `@media (prefers-reduced-motion: reduce)` automáticamente.

---

## 5. Accesibilidad (WCAG AA)

- **Contraste:** todos los pares text/bg validados ≥ 4.5:1 (4xs ≥ 3:1).
- **Focus visible:** anillo de 4 px en todos los elementos interactivos vía `:focus-visible`.
- **Inputs:** siempre con `<label htmlFor>` + `aria-invalid` + `aria-describedby` para errores.
- **Iconos decorativos:** `aria-hidden="true"`.
- **Botones de icono:** `aria-label` obligatorio (ej. botón ojo de password).
- **Reduced motion:** todos los `transition` y `animation` se reducen a 0.01ms con la media query.

---

## 6. Convenciones de código

- **CSS Modules:** un `.module.scss` por componente/page. Tokens vía CSS variables, no SCSS variables.
- **Naming:** camelCase para clases (`btnPrimary`, `cardContainer`).
- **No `!important`** salvo `prefers-reduced-motion` (override de la cascada animation).
- **No estilos inline** salvo gates de tema que requieran token dinámico.
- **Iconos:** `lucide-react` (tree-shakeable).

---

## 7. Roadmap sistema de diseño

Pendiente para Fase 2:

- [ ] Componentes UI reutilizables: `Button`, `Input`, `Select`, `Modal`, `Toast`, `Badge` (extraer de pages al `components/ui/`)
- [ ] Storybook ligero (con `vite-plugin-storybook` o equivalente)
- [ ] Tokens exportables a JSON (Style Dictionary) para compartir con Power Automate / Figma
- [ ] Theme switcher visible en UI (toggle oscuro/claro/sistema)
- [ ] Tests visuales con Playwright o Chromatic
- [ ] Dark/light auto-switch via `prefers-color-scheme` cuando no hay preferencia guardada

---

_Mantenedor: equipo DAILY · Última actualización: auditoría 2026-05_
