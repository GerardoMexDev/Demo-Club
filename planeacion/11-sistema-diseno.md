# Sistema de Diseño — PULSO Club (Demo)

> Identidad propuesta por Claude (Gerardo delegó la dirección visual). Personalidad: **enérgico, premium, confiable**. Rubro: club deportivo multi-disciplina. Dispositivo dominante: mobile (alumno) + desktop (admin). Sin marca previa → se diseña de cero.
>
> Concepto: **"PULSO"** — el club como el punto donde laten distintas disciplinas (fútbol, básquet, vóley, karate...) al mismo ritmo. Fidelidad: nivel "App/PWA completo" (doc 11, A.4) porque hay dos portales, estados, y necesita sentirse un producto, no una landing.

## B.1 — Escalas de color (crudas)

**Primario — Ember (energía, acción, CTAs):**
`50 #FFF3EC` · `100 #FFE1D0` · `200 #FFC29F` · `300 #FF9E6B` · `400 #FF7F42` · `500 #FF6620` · `600 #E84E0A` · `700 #C13D06` · `800 #953007` · `900 #6E2508`

**Secundario — Teal (confianza, información, profesional):**
`50 #EAFBFC` · `100 #CFF5F7` · `200 #9FE9EE` · `300 #66D6DE` · `400 #34BEC9` · `500 #14A0AC` · `600 #0D818B` · `700 #0A666E` · `800 #095059` · `900 #073F46`

**Neutros — Graphite (base oscura, tono frío):**
`50 #F5F7F9` · `100 #E7EBEF` · `200 #CCD3DB` · `300 #A6B0BD` · `400 #78838F` · `500 #545F6B` · `600 #3C4650` · `700 #2A323A` · `800 #191F26` · `900 #0D1116`

**Semánticos:** éxito `#22C55E` (fondo dark `#143321`) · error `#EF4444` (fondo dark `#3A1414`) · advertencia `#F5A623` (fondo dark `#3A2A0C`) · info = teal-500 (fondo dark `#0D2E31`)

**Paleta de disciplinas** (chips, no son tokens de marca — se asignan rotando a cada disciplina nueva): verde `#4ADE80` · naranja `#FF9E6B` · azul `#60A5FA` · rojo `#F87171` · violeta `#C084FC` · amarillo `#FACC15`

## B.2 — Tokens semánticos

| Token | Apunta a | Uso |
|---|---|---|
| `--color-primario` | ember-500 | Botones principales, CTAs, focus ring |
| `--color-primario-hover` | ember-600 | Hover de botón primario |
| `--color-secundario` | teal-500 | Links, badges informativos, estado "info" |
| `--color-texto` | neutro-50 | Texto principal (sobre fondo oscuro) |
| `--color-texto-suave` | neutro-400 | Subtítulos, texto muted |
| `--color-fondo` | neutro-900 | Fondo general de la app |
| `--color-fondo-alt` | neutro-800 | Cards, paneles, inputs |
| `--color-borde` | neutro-700 | Divisores, bordes de card/input |
| `--color-error` / `-exito` / `-adv` / `-info` | semánticos | Validaciones, toasts, estados de clase |

## B.3 — Tipografía

- Títulos: **Space Grotesk** (Google Fonts) — geométrica, con carácter, evita el look "SaaS genérico" de Inter sola.
- Cuerpo/UI: **Inter** (Google Fonts) — máxima legibilidad en tablas y formularios.
- Base 16px, escala 1.25, line-height 1.5 cuerpo / 1.15 títulos. Pesos: 400/500 cuerpo, 600 semibold, 700 títulos.

| Nivel | Desktop / Mobile | Peso | Fuente |
|---|---|---|---|
| H1 | 39px / 28px | 700 | Space Grotesk |
| H2 | 31px / 24px | 700 | Space Grotesk |
| H3 | 25px / 20px | 600 | Space Grotesk |
| Cuerpo | 16px / 16px | 400 | Inter |
| Small / legal | 13px / 13px | 400 | Inter |
| Botón | 16px | 600 | Inter |

## B.4 — Espaciado y grilla

- Base 8px → escala 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
- Container máximo (admin/desktop): 1200px. Padding lateral mobile: 16px.
- Breakpoints (doc 07): mobile <640px · tablet 640–1023px · desktop ≥1024px.
- Enfoque mobile-first en TODO, con énfasis extra en el portal Alumno (uso 100% celular).

## B.5 — Formas y elevación

- Radios: sm `6px` (inputs, chips) · md `12px` (botones, cards) · lg `20px` (modales, hoja inferior mobile) · full `9999px` (avatares, pills, badges).
- Sombras (fondo oscuro → sombras sutiles, no "negro sobre negro"): sm `0 1px 2px rgba(0,0,0,.4)` · md `0 4px 12px rgba(0,0,0,.45)` · lg `0 12px 32px rgba(0,0,0,.5)`.
- Glow de foco/selección: `0 0 0 3px rgba(255,102,32,.25)` (accesibilidad + identidad).

## B.6 — Componentes base

- **Botón primario**: fondo `--color-primario`, texto `#1A0D05` (oscuro, mejor contraste sobre naranja que blanco), radio md, padding 12px/24px, peso 600. Hover: `--color-primario-hover`. Disabled: neutro-700 fondo, neutro-500 texto. Focus: glow ring.
- **Botón secundario**: fondo transparente, borde 1px `--color-borde`, texto `--color-texto`. Hover: fondo neutro-800.
- **Botón de acción WhatsApp**: fondo `#25D366` (verde oficial de WhatsApp, único lugar donde se usa — asociación directa con la acción), texto blanco, ícono de WhatsApp.
- **Input**: fondo `--color-fondo-alt`, borde `--color-borde`, radio sm, padding 12px, focus borde `--color-primario` + glow. Error: borde `--color-error` + texto de error debajo.
- **Card**: fondo `--color-fondo-alt`, borde 1px `--color-borde` (hairline para definición sobre fondo oscuro), radio md, sombra sm, padding 24px desktop / 16px mobile.
- **Nav inferior (mobile, portal Alumno)**: fija, fondo neutro-900 con blur, 4 accesos (Inicio · Explorar · Mi Horario · Perfil), ítem activo en `--color-primario`, target táctil ≥48px.
- **Toast**: fondo `--color-fondo-alt`, borde izquierdo 4px del color semántico correspondiente, ícono + texto, entra con slide+fade 250ms, autodescarta a los 3.5s.

## B.7 — Estados interactivos

- Hover / active / disabled / focus definidos en cada componente base (B.6).
- Focus visible obligatorio (accesibilidad, doc 16): nunca `outline: none` sin reemplazo.
- Loading: skeleton con shimmer sutil en cards/listas (nunca spinner default del navegador).
- Timings estándar: 150ms (micro, hover) · 250ms (normal, toasts/modales) · 400ms (énfasis, cambios de vista). Se respeta `prefers-reduced-motion`.

## B.8 — Iconografía y marca

- Set de íconos: outline, trazo 1.5-2px, consistente (line-icons estilo Feather/Lucide).
- Logotipo: wordmark "PULSO" en Space Grotesk 700, con un punto (●) en `--color-primario` reemplazando el acento, evocando un "pulso"/latido.

## B.9 — Salida en código (variables CSS)

```css
:root {
  /* Color — tokens semánticos */
  --color-primario: #FF6620;
  --color-primario-hover: #E84E0A;
  --color-secundario: #14A0AC;
  --color-texto: #F5F7F9;
  --color-texto-suave: #78838F;
  --color-fondo: #0D1116;
  --color-fondo-alt: #191F26;
  --color-borde: #2A323A;
  --color-error: #EF4444;
  --color-exito: #22C55E;
  --color-advertencia: #F5A623;
  --color-info: #14A0AC;
  --color-whatsapp: #25D366;

  /* Tipografía */
  --fuente-titulos: 'Space Grotesk', system-ui, sans-serif;
  --fuente-base: 'Inter', system-ui, sans-serif;
  --texto-h1: 2.441rem;
  --texto-h2: 1.953rem;
  --texto-h3: 1.563rem;
  --texto-cuerpo: 1rem;
  --texto-small: 0.8125rem;

  /* Espaciado */
  --esp-xs: 4px; --esp-sm: 8px; --esp-md: 16px;
  --esp-lg: 24px; --esp-xl: 32px; --esp-2xl: 48px; --esp-3xl: 64px;

  /* Formas */
  --radio-sm: 6px; --radio-md: 12px; --radio-lg: 20px; --radio-full: 9999px;
  --sombra-sm: 0 1px 2px rgba(0,0,0,.4);
  --sombra-md: 0 4px 12px rgba(0,0,0,.45);
  --sombra-lg: 0 12px 32px rgba(0,0,0,.5);
  --glow-primario: 0 0 0 3px rgba(255,102,32,.25);

  /* Timing */
  --dur-rapido: 150ms; --dur-normal: 250ms; --dur-enfasis: 400ms;

  --container-max: 1200px;
}
```

Este sistema queda aprobado en el momento en que Gerardo confirma seguir adelante (ver `avances.md`). A partir de ahí, todo el CSS del proyecto sale de estos tokens — ningún color/tamaño/espaciado suelto "a ojo".
