<p align="center">
  <a href="README.md">日本語</a> ·
  <a href="README.en.md">English</a> ·
  <a href="README.ko.md">한국어</a> ·
  <strong>Español</strong> ·
  <a href="README.fr.md">Français</a>
</p>

<h1 align="center">Council — Skill de apoyo a decisiones por consejo deliberativo</h1>

<p align="center">
  <em>Una skill de Claude que ofrece opiniones desde múltiples ángulos sobre decisiones personales mediante un consejo de 3 personas</em>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/version-3.1-blue.svg" alt="Version 3.1">
  <a href="SKILL.md"><img src="https://img.shields.io/badge/Claude-Skill-D97757.svg" alt="Claude Skill"></a>
  <img src="https://img.shields.io/badge/mode-light%20%2B%20heavy-purple.svg" alt="Light + Heavy mode">
  <img src="https://img.shields.io/badge/lang-ja%20%7C%20en%20%7C%20ko%20%7C%20es%20%7C%20fr-lightgrey.svg" alt="Languages">
</p>

<p align="center">
  <a href="https://claude.ai"><img src="https://img.shields.io/badge/Abrir%20en-Claude.ai-D97757?style=for-the-badge" alt="Abrir en Claude.ai"></a>
  <a href="https://codespaces.new/samejima-ai/council"><img src="https://github.com/codespaces/badge.svg" alt="Abrir en GitHub Codespaces"></a>
</p>

> Una skill que responde a un dilema puntual o encrucijada del usuario con opiniones desde múltiples ángulos, presentadas por tres personas seleccionadas dinámicamente según el tema y la situación.

**Versión**: 3.1 / **Objetivo**: Claude.ai (chat) · Claude Code · otros entornos compatibles con skills de Claude / **API**: `window.claude.complete()` / **Licencia**: MIT

> [!NOTE]
> "Abrir en Claude.ai" es un atajo a la página principal de Claude.ai. Aún no existe un instalador de skills de un solo clic — para la primera ejecución, sigue la [Inicio rápido](#inicio-rápido) más abajo para cargar SKILL.md en un Project.

> [!IMPORTANT]
> La skill está escrita en japonés (SKILL.md, instrucciones de personas, frases disparadoras). Sin embargo, **gracias a la coincidencia semántica de Claude, la skill se activa también en otros idiomas** — decir en español "convoca al consejo para decidir X" funciona. El idioma de salida sigue al idioma de entrada. Los disparadores originales en japonés (p. ej., 「councilで」「合議して」) también funcionan.

---

## ¿Qué es esto?

Cuando llevas una preocupación a Claude, normalmente recibes una sola respuesta. Es cómodo, pero **se pierde el escrutinio multiangular**.

Council orquesta una deliberación entre **tres modos de pensamiento independientes** (elegidos dinámicamente de un grupo de 5 personas) y luego una capa JUDGE los integra. Las dos personas no convocadas siguen teniendo voz mediante un Minority Report escrito por JUDGE.

**Objetivo**: no imponerte una conclusión. Más bien, presentar los materiales para que **llegues a una respuesta con la que tú mismo puedas estar de acuerdo**.

---

## Características

- **Pool de 5 personas**: Sabio / Estratega / Intuitivo / Rebelde / Hombre Común
- **Selección dinámica de 3 personas**: una capa de triaje elige 3 (2 principales + 1 de apoyo) según tema y contexto
- **Arquitectura de 3 capas**: Triaje / Consejo / JUDGE
- **Dos modos de ejecución**:
  - Modo ligero: un único Claude interpreta todos los roles directamente en el chat
  - Modo intensivo: 3 ejecuciones paralelas **físicamente independientes** mediante `window.claude.complete()`
- **Voz para los ausentes**: JUDGE representa a las dos personas no convocadas en un Minority Report, simulando la amplitud de las 5
- **Ejes R/R/A**: Regret (arrepentimiento) / Reversibility (reversibilidad) / Alignment (alineación con tus valores)
- **Estrategia de ausencia + fallback**: degradación elegante ante fallos de API
- **Eficiencia de coste**: 4 llamadas API por deliberación (~9 % del límite de 5 horas de Claude.ai Pro)
- **Neutralidad estricta**: rechaza empujar al usuario hacia una respuesta única

---

## Cómo invocarla

La skill se activa solo cuando el usuario lo pide explícitamente. Funcionan tanto los disparadores originales en japonés como los equivalentes en español:

| Disparador original (japonés) | Equivalente en español (también activa la skill) |
|---|---|
| 「councilで」「council起動」「council召喚」 | "usa el consejo", "convoca al consejo" |
| 「合議して」「合議制で」 | "delibera en consejo", "en modo deliberativo" |
| 「多角的に意見が欲しい」「いろんな視点で」 | "quiero opiniones desde múltiples ángulos", "desde diferentes perspectivas" |
| 「Councilメンバーに聞いて」 | "pregunta a los miembros del consejo" |

La skill **no se activa** ante quejas comunes o charla casual (anti-falsa-activación).

---

## Estructura de archivos

```
council/
├── README.md                          日本語 (idioma principal)
├── README.en.md                       English
├── README.ko.md                       한국어
├── README.es.md                       Español (este archivo)
├── README.fr.md                       Français
├── SKILL.md                           cuerpo de la skill (debe cargarse)
├── LICENSE                            licencia MIT
├── CHANGELOG.md                       historial de cambios
├── references/
│   ├── light-mode-format.md           especificación del formato del modo ligero
│   ├── heavy-mode-artifact.md         guía de implementación de Artifact (modo intensivo)
│   ├── examples.md                    ejemplos de entrada/salida
│   ├── installation.md                instalación por entorno
│   ├── customization.md               guía de personalización
│   └── troubleshooting.md             FAQ / manejo de fallos
└── examples/
    └── council-heavy-mode.jsx         implementación de referencia del modo intensivo (React)
```

---

## Inicio rápido

### Si usas Claude.ai

1. Inicia sesión en [Claude.ai](https://claude.ai)
2. Crea un nuevo Project
3. Sube los archivos de este repositorio al Project Knowledge (al menos `SKILL.md` + `references/`)
4. En las Custom Instructions del Project, declara que Council SK está disponible
5. Dentro de ese Project, di "usa el consejo para X" — o en japonés, 「councilで〇〇について相談したい」

### Si usas Claude Code

```bash
# 1. Clona en tu directorio de skills
git clone https://github.com/samejima-ai/council.git ~/.claude/skills/council

# 2. Inicia Claude Code y pide usar el consejo (se detecta automáticamente)
```

Para instalación local del proyecto, coloca el contenido en `<proyecto>/.claude/skills/council/`.

Consulta [`references/installation.md`](references/installation.md) para más detalles.

---

## Casos de uso

| En el alcance | ✅ |
|----|----|
| Decisiones de carrera (cambio de empleo, estudios, emprender, salir) | ✅ |
| Relaciones (románticas, amistades, trabajo) | ✅ |
| Saltos creativos (arte, emprendimiento, nuevos proyectos) | ✅ |
| Decisiones financieras (inversión, compras grandes, vivienda) | ✅ |
| Conflictos éticos (deber familiar, decisiones morales) | ✅ |
| Salir del estancamiento | ✅ |

| Fuera del alcance | ❌ |
|----|----|
| Decisiones técnicas de implementación | ❌ usa otra skill |
| Decidir en nombre de otros | ❌ requiere implicación personal |
| Emergencias reales (riesgo vital, etc.) | ❌ contacta a profesionales |
| Verificación de hechos / búsqueda | ❌ usa búsqueda web, etc. |

---

## Filosofía de diseño

### ¿Por qué un consejo?

Las decisiones desde una única perspectiva siempre dejan puntos ciegos. Las decisiones importantes históricamente se han enrutado por estructuras con múltiples revisores — parlamentos, consejos, paneles de jueces. A medida que los LLM entran en el apoyo a decisiones personales, esta estructura debería heredarse.

### ¿Por qué 3 personas y no 5?

Convocar a las 5 cada vez es ideal pero costoso en llamadas API y carga cognitiva. **3 personas (2 principales + 1 de apoyo)** es la configuración mínima que preserva ejes opuestos manteniéndose asequible. JUDGE representa a las 2 ausentes en un Minority Report, simulando la amplitud de las 5.

### ¿Por qué las personas no saben quiénes más fueron seleccionados?

Si una persona supiera "fui elegido porque…" o "X también fue elegido", la opinión se reforzaría o debilitaría inconscientemente — la independencia colapsaría. La selección se fija antes de la deliberación pero se mantiene oculta hasta que termina.

### ¿Por qué no se impone una conclusión?

Esta skill es un **dispositivo de apoyo a decisiones**, no un **decisor**. La conclusión integrada de JUDGE es material de referencia; la decisión final es tuya.

---

## Limitaciones conocidas

- **Dependencia de Claude.ai**: `window.claude.complete()` solo existe en el entorno Artifact de Claude.ai
- **Sin selección de modelo**: Claude.ai elige el modelo
- **Límite superior de paralelismo desconocido**: 3 paralelos están probados; el límite real depende de la implementación de Claude.ai
- **Coste API del paralelismo de 3 personas**: 4 llamadas por deliberación (4 de ~45 en una ventana Pro de 5 horas)
- **El historial del chat es volátil**: las deliberaciones pasadas no se guardan automáticamente (usa el modo intensivo para materializarlas como Artifacts)

---

## Errores y contribuciones

Esta skill es un experimento de pensamiento para apoyo a decisiones personales. Los reportes de errores y propuestas de mejora son bienvenidos vía GitHub Issues.

---

## Licencia

Licencia MIT — ver [`LICENSE`](LICENSE).

---

## Documentación relacionada

| Documento | Propósito |
|----|----|
| [SKILL.md](SKILL.md) | el cuerpo de la skill — núcleo de la implementación |
| [references/installation.md](references/installation.md) | configuración por entorno |
| [references/examples.md](references/examples.md) | ejemplos de entrada/salida |
| [references/customization.md](references/customization.md) | cómo personalizar |
| [references/troubleshooting.md](references/troubleshooting.md) | FAQ / manejo de fallos |
| [CHANGELOG.md](CHANGELOG.md) | historial de cambios |
