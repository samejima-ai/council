<p align="center">
  <a href="README.md">日本語</a> ·
  <strong>English</strong> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a>
</p>

<h1 align="center">Council — Deliberative Decision Support Skill</h1>

<p align="center">
  <em>A Claude skill that surfaces multi-angle opinions on personal decisions through a 3-persona council</em>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/version-3.1-blue.svg" alt="Version 3.1">
  <a href="SKILL.md"><img src="https://img.shields.io/badge/Claude-Skill-D97757.svg" alt="Claude Skill"></a>
  <img src="https://img.shields.io/badge/mode-light%20%2B%20heavy-purple.svg" alt="Light + Heavy mode">
  <img src="https://img.shields.io/badge/lang-ja%20%7C%20en%20%7C%20ko%20%7C%20es%20%7C%20fr-lightgrey.svg" alt="Languages">
</p>

<p align="center">
  <a href="https://claude.ai"><img src="https://img.shields.io/badge/Open%20in-Claude.ai-D97757?style=for-the-badge" alt="Open in Claude.ai"></a>
  <a href="https://codespaces.new/samejima-ai/council"><img src="https://github.com/codespaces/badge.svg" alt="Open in GitHub Codespaces"></a>
</p>

> A skill that responds to a user's one-off dilemma or fork-in-the-road with multi-angle opinions from three personas dynamically selected for the topic and situation.

**Version**: 3.1 / **Target**: Claude.ai (chat) · Claude Code · other Claude-skill-capable environments / **API**: `window.claude.complete()` / **License**: MIT

> [!NOTE]
> "Open in Claude.ai" is a shortcut to the Claude.ai homepage. There is no one-click skill installer yet — for the first run, follow the [Quick start](#quick-start) below to load SKILL.md into a Project.

> [!IMPORTANT]
> The skill itself is written in Japanese (SKILL.md, persona instructions, trigger phrases). However, **Claude's semantic matching means the skill triggers across languages** — saying "use the council to decide X" or "convene a council on X" in English will fire it. The output language follows your input language. The original Japanese triggers (e.g. 「councilで」「合議して」) also work.

---

## What is this?

When you bring a worry to Claude, you usually get a single response. Convenient — but multi-angled scrutiny is lost.

Council orchestrates a deliberation among **three independent thinking modes** (dynamically chosen from a pool of 5 personas) and then has a JUDGE layer integrate them. The two personas not summoned still get their voices heard via a Minority Report written by JUDGE.

**Goal**: not to push a conclusion on you. Instead, to surface the materials you need to **arrive at an answer you yourself can accept**.

---

## Highlights

- **Pool of 5 personas**: Sage / Strategist / Intuitive / Rebel / Everyman
- **Dynamic 3-persona selection**: a triage layer picks 3 (2 primary + 1 supporting) based on topic and context
- **3-layer architecture**: Triage / Council / JUDGE
- **Two execution modes**:
  - Light mode: a single Claude plays all roles inline in the chat
  - Heavy mode: 3 **physically independent** parallel runs via `window.claude.complete()`
- **Speaking for the absent**: JUDGE represents the two unsummoned personas in a Minority Report, simulating 5-persona breadth
- **R/R/A axes**: Regret / Reversibility / Alignment (with your values)
- **Absence + fallback strategy**: graceful degradation under API failure
- **Cost-efficient**: 4 API calls per deliberation (~9% of Claude.ai Pro's 5-hour budget)
- **Strict neutrality**: refuses to push the user toward a single answer

---

## How to invoke

The skill fires only when the user explicitly asks for it. Native Japanese triggers and English equivalents both work:

| Original Japanese trigger | English (also fires the skill) |
|---|---|
| 「councilで」「council起動」「council召喚」 | "use the council", "convene a council" |
| 「合議して」「合議制で」 | "deliberate together", "convene a deliberation" |
| 「多角的に意見が欲しい」「いろんな視点で」 | "I want multi-angle opinions", "from different perspectives" |
| 「Councilメンバーに聞いて」 | "ask the council members" |

The skill **does not** fire for ordinary venting or chit-chat (anti-misfire).

---

## File layout

```
council/
├── README.md                          Japanese (primary)
├── README.en.md                       English (this file)
├── README.ko.md                       한국어
├── README.es.md                       Español
├── README.fr.md                       Français
├── SKILL.md                           skill body (must be loaded by Claude)
├── LICENSE                            MIT license
├── CHANGELOG.md                       revision history
├── references/
│   ├── light-mode-format.md           output format spec for light mode
│   ├── heavy-mode-artifact.md         Artifact implementation guide for heavy mode
│   ├── examples.md                    sample inputs / outputs
│   ├── installation.md                per-environment setup
│   ├── customization.md               customization guide
│   └── troubleshooting.md             FAQ / failure handling
└── examples/
    └── council-heavy-mode.jsx         heavy-mode reference implementation (React)
```

---

## Quick start

### On Claude.ai

1. Sign in to [Claude.ai](https://claude.ai)
2. Create a new Project
3. Upload this repo's files to the Project Knowledge (at minimum `SKILL.md` + `references/`)
4. In the Project's Custom Instructions, declare that Council SK is available
5. Inside that Project, say "use the council on X" — or in Japanese, 「councilで〇〇について相談したい」

### On Claude Code

```bash
# 1. Clone into your skills directory
git clone https://github.com/samejima-ai/council.git ~/.claude/skills/council-jp

# 2. Start Claude Code and ask it to use the council (auto-detected)
```

For project-local installs, place the contents under `<project>/.claude/skills/council-jp/`.

See [`references/installation.md`](references/installation.md) for full details.

---

## Use cases

| In scope | ✅ |
|----|----|
| Career choices (job change, schooling, founding, exit) | ✅ |
| Relationships (romantic, friendships, workplace) | ✅ |
| Creative leaps (art, entrepreneurship, new ventures) | ✅ |
| Money decisions (investment, big purchases, housing) | ✅ |
| Ethical conflicts (family duty, moral choices) | ✅ |
| Breaking out of stagnation | ✅ |

| Out of scope | ❌ |
|----|----|
| Technical implementation decisions | ❌ use a different skill |
| Deciding on someone else's behalf | ❌ requires personal stake |
| Genuine emergencies (life-threatening, etc.) | ❌ contact professionals |
| Fact-checking / search | ❌ use web search etc. |

### Example prompts

What users actually type:

```
Use the council — I'm 32 and considering a career change.
Salary's stable here, but I'm not growing. I have a family
and don't want to overshoot on risk.
```

```
Convene a council on this. My partner and I (we live together)
are drifting on values. Should I leave, or stay longer?
```

```
I want multi-angle opinions. I have $30k from an investment.
Should I bootstrap a business with it, or pay down the mortgage?
```

```
Use the council. There's family pressure to move closer to my
elderly parent, but I'm worried about my career. Help me think.
```

Triggers fire from English (e.g. `use the council to...`) as well as the original Japanese (「councilで」「合議して」 etc.) — Claude's semantic matching covers both.

---

## Why pick this one?

The "Multi-Persona Council" space on Claude is getting crowded. Here's an honest comparison so you can pick the right tool.

### The typical approach in this space

- A fixed roster of 7–18 personas, all summoned every time
- Main use case: technical decisions (code review / architecture / strategy)
- Outputs a "verdict"
- Implemented as Claude Code sub-agents
- English-first

### Council SK's stance

| Axis | Typical approach | Council SK (`council-jp`) |
|---|---|---|
| Persona selection | N personas, fixed | **3 dynamically picked from a pool of 5** (topic-aware) |
| Main use case | technical decisions | **personal life decisions** (career / relationships / money / ethics) |
| Conclusion stance | hands you a verdict | **strict neutrality** (no pushed answer) |
| Independence | not usually addressed | **blind selection** (personas don't know who else was picked) |
| Execution modes | single mode | **light + heavy** (heavy runs physically isolated in Claude.ai Artifacts) |
| Evaluation axes | free-form | **R/R/A** (Regret / Reversibility / Alignment) |
| Absent personas | dropped | **JUDGE speaks for them** in a Minority Report |
| Primary language | English | **Japanese-first** (with multilingual READMEs) |

### Related projects

- [itshussainsprojects/Claude-Council-Skill](https://github.com/itshussainsprojects/Claude-Council-Skill) — 7 personas, personal-decision oriented (closest in spirit)
- [0xNyk/council-of-high-intelligence](https://github.com/0xNyk/council-of-high-intelligence) — 18 personas (Aristotle, Feynman, Kahneman, etc.), multi-LLM provider
- [tsenart/council-skill](https://github.com/tsenart/council-skill) — portable across Codex / Claude Code / Amp
- [wan-huiyan/agent-review-panel](https://github.com/wan-huiyan/agent-review-panel) — adversarial panel for code/plan review

This space is active and the field will keep growing. Council SK (`council-jp`) earns its niche through the combination of **personal-life focus × strict neutrality × dual-mode × Japanese-first**.

---

## Design philosophy

### Why "few and biased" — the core thesis

A council should be done with **the smallest number of sharply-characterized members**.

What matters is **deliberation by biased opinions**, not majority vote.

Human councils crystallize wisdom by aggregating multiple perspectives via majority decision. But mapping that structure onto AI does not extract the best answer.

**The way to extract the best from AI is to take condensed, biased perspectives, slam them head-on, and let them be sublated (Aufhebung / 止揚)** — this is Council SK's core thesis.

That's why Council SK does not "line up many personas to reach consensus." Instead it deliberately collides **a small number of sharp viewpoints and lets JUDGE perform the sublation**.

3-from-5 dynamic selection / 2-primary + 1-supporting / blind selection / R/R/A axes — every design choice is derived from this single thesis.

### Why a council at all?

Single-perspective decisions always leave blind spots. Important decisions have historically been routed through multi-checker structures — parliaments, boards, panels of judges. As LLMs enter personal decision support, this structure should be carried forward.

But AI deliberation is structurally not the same as human deliberation — see the "core thesis" above.

### Why don't personas know who else was picked?

If a persona learns "I was chosen because…" or "X was also chosen", the opinion is unconsciously reinforced or weakened — independence collapses. Selection is fixed before deliberation but kept secret from the personas until it ends.

### Why no pushed conclusion?

This skill is a **decision-support device**, not a **decider**. JUDGE's integrated conclusion is reference material; the final call is yours.

---

## Known constraints

- **Claude.ai dependence**: `window.claude.complete()` only exists in the Claude.ai Artifact environment
- **No model selection**: Claude.ai picks the model
- **Parallelism upper bound unknown**: 3-way parallel is tested; the actual cap depends on Claude.ai's implementation
- **API cost of 3-persona parallel**: 4 calls per deliberation (4 of ~45 in a Pro 5-hour window)
- **Chat history is volatile**: past deliberations are not auto-saved (use heavy mode to materialize them as Artifacts)

---

## Bugs and contributions

This skill is a thought experiment for personal decision support. Bug reports and improvement proposals are welcome via GitHub Issues.

---

## License

MIT License — see [`LICENSE`](LICENSE).

---

## Related docs

| Doc | Purpose |
|----|----|
| [SKILL.md](SKILL.md) | the skill body — implementation core |
| [references/installation.md](references/installation.md) | per-environment setup |
| [references/examples.md](references/examples.md) | sample inputs / outputs |
| [references/customization.md](references/customization.md) | how to customize |
| [references/troubleshooting.md](references/troubleshooting.md) | FAQ / failure handling |
| [CHANGELOG.md](CHANGELOG.md) | revision history |
