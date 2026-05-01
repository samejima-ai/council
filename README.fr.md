<p align="center">
  <a href="README.md">日本語</a> ·
  <a href="README.en.md">English</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.es.md">Español</a> ·
  <strong>Français</strong>
</p>

<h1 align="center">Council — Skill d'aide à la décision par conseil délibératif</h1>

<p align="center">
  <em>Une skill Claude qui propose des avis multi-angles sur les décisions personnelles via un conseil de 3 personas</em>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/version-3.1-blue.svg" alt="Version 3.1">
  <a href="SKILL.md"><img src="https://img.shields.io/badge/Claude-Skill-D97757.svg" alt="Claude Skill"></a>
  <img src="https://img.shields.io/badge/mode-light%20%2B%20heavy-purple.svg" alt="Light + Heavy mode">
  <img src="https://img.shields.io/badge/lang-ja%20%7C%20en%20%7C%20ko%20%7C%20es%20%7C%20fr-lightgrey.svg" alt="Languages">
</p>

<p align="center">
  <a href="https://claude.ai"><img src="https://img.shields.io/badge/Ouvrir%20dans-Claude.ai-D97757?style=for-the-badge" alt="Ouvrir dans Claude.ai"></a>
  <a href="https://codespaces.new/samejima-ai/council"><img src="https://github.com/codespaces/badge.svg" alt="Ouvrir dans GitHub Codespaces"></a>
</p>

> Une skill qui répond à un dilemme ponctuel ou à une bifurcation de l'utilisateur avec des avis multi-angles, présentés par trois personas dynamiquement sélectionnés selon le sujet et la situation.

**Version** : 3.1 / **Cible** : Claude.ai (chat) · Claude Code · autres environnements compatibles avec les skills Claude / **API** : `window.claude.complete()` / **Licence** : MIT

> [!NOTE]
> « Ouvrir dans Claude.ai » est un raccourci vers la page d'accueil de Claude.ai. Il n'existe pas encore d'installeur de skill en un clic — pour la première utilisation, suivez le [Démarrage rapide](#démarrage-rapide) ci-dessous pour charger SKILL.md dans un Project.

> [!IMPORTANT]
> La skill elle-même est rédigée en japonais (SKILL.md, instructions des personas, phrases déclencheuses). Cependant, **grâce à la correspondance sémantique de Claude, la skill se déclenche aussi dans d'autres langues** — dire en français « convoque le conseil pour décider de X » fonctionne. La langue de sortie suit la langue d'entrée. Les déclencheurs originaux en japonais (p. ex. 「councilで」「合議して」) fonctionnent également.

---

## Qu'est-ce que c'est ?

Quand vous soumettez un problème à Claude, vous obtenez généralement une seule réponse. C'est pratique, mais **la pluralité des angles est perdue**.

Council orchestre une délibération entre **trois modes de pensée indépendants** (sélectionnés dynamiquement parmi un pool de 5 personas), puis une couche JUDGE les intègre. Les deux personas non convoqués font tout de même entendre leur voix via un Minority Report rédigé par JUDGE.

**Objectif** : ne pas vous imposer une conclusion. Plutôt, présenter les éléments dont vous avez besoin pour **arriver à une réponse que vous pouvez vous-même accepter**.

---

## Points clés

- **Pool de 5 personas** : Sage / Stratège / Intuitif / Rebelle / Homme Commun
- **Sélection dynamique de 3 personas** : une couche de triage choisit 3 personas (2 principaux + 1 d'appui) selon le sujet et le contexte
- **Architecture à 3 couches** : Triage / Conseil / JUDGE
- **Deux modes d'exécution** :
  - Mode léger : un seul Claude joue tous les rôles directement dans le chat
  - Mode intensif : 3 exécutions parallèles **physiquement indépendantes** via `window.claude.complete()`
- **Parler pour les absents** : JUDGE représente les deux personas non convoqués dans un Minority Report, simulant l'envergure des 5
- **Axes R/R/A** : Regret / Reversibility (réversibilité) / Alignment (alignement avec vos valeurs)
- **Stratégie d'absence + fallback** : dégradation gracieuse en cas de panne API
- **Efficacité-coût** : 4 appels API par délibération (~9 % du quota 5 h de Claude.ai Pro)
- **Neutralité stricte** : refuse de pousser l'utilisateur vers une réponse unique

---

## Comment l'invoquer

La skill ne se déclenche que lorsque l'utilisateur le demande explicitement. Les déclencheurs japonais d'origine et leurs équivalents français fonctionnent tous :

| Déclencheur original (japonais) | Équivalent français (déclenche aussi la skill) |
|---|---|
| 「councilで」「council起動」「council召喚」 | « avec le conseil », « convoque le conseil » |
| 「合議して」「合議制で」 | « délibère en conseil », « en mode délibératif » |
| 「多角的に意見が欲しい」「いろんな視点で」 | « je veux des avis multi-angles », « depuis différents points de vue » |
| 「Councilメンバーに聞いて」 | « demande aux membres du conseil » |

La skill **ne se déclenche pas** lors de simples plaintes ou de bavardage (anti-faux-déclenchement).

---

## Structure des fichiers

```
council/
├── README.md                          日本語 (langue principale)
├── README.en.md                       English
├── README.ko.md                       한국어
├── README.es.md                       Español
├── README.fr.md                       Français (ce fichier)
├── SKILL.md                           corps de la skill (à charger obligatoirement)
├── LICENSE                            licence MIT
├── CHANGELOG.md                       historique des révisions
├── references/
│   ├── light-mode-format.md           spécification du format du mode léger
│   ├── heavy-mode-artifact.md         guide d'implémentation Artifact (mode intensif)
│   ├── examples.md                    exemples d'entrée/sortie
│   ├── installation.md                installation par environnement
│   ├── customization.md               guide de personnalisation
│   └── troubleshooting.md             FAQ / gestion des pannes
└── examples/
    └── council-heavy-mode.jsx         implémentation de référence du mode intensif (React)
```

---

## Démarrage rapide

### Si vous utilisez Claude.ai

1. Connectez-vous à [Claude.ai](https://claude.ai)
2. Créez un nouveau Project
3. Téléversez les fichiers de ce dépôt dans le Project Knowledge (au minimum `SKILL.md` + `references/`)
4. Dans les Custom Instructions du Project, déclarez que Council SK est disponible
5. À l'intérieur de ce Project, dites « utilise le conseil pour X » — ou en japonais, 「councilで〇〇について相談したい」

### Si vous utilisez Claude Code

```bash
# 1. Cloner dans votre répertoire de skills
git clone https://github.com/samejima-ai/council.git ~/.claude/skills/council

# 2. Démarrer Claude Code et demander d'utiliser le conseil (détection automatique)
```

Pour une installation locale au projet, placez le contenu sous `<projet>/.claude/skills/council/`.

Voir [`references/installation.md`](references/installation.md) pour les détails complets.

---

## Cas d'usage

| Dans le périmètre | ✅ |
|----|----|
| Choix de carrière (changement de poste, études, création, sortie) | ✅ |
| Relations (amoureuses, amitiés, travail) | ✅ |
| Sauts créatifs (art, entrepreneuriat, nouveaux projets) | ✅ |
| Décisions financières (investissement, gros achats, logement) | ✅ |
| Conflits éthiques (devoir familial, choix moraux) | ✅ |
| Sortir de la stagnation | ✅ |

| Hors périmètre | ❌ |
|----|----|
| Décisions techniques d'implémentation | ❌ utilisez une autre skill |
| Décider à la place d'autrui | ❌ implication personnelle requise |
| Urgences réelles (danger vital, etc.) | ❌ contactez des professionnels |
| Vérification de faits / recherche | ❌ utilisez la recherche web, etc. |

---

## Philosophie de conception

### Pourquoi un conseil ?

Les décisions à perspective unique laissent toujours des angles morts. Historiquement, les décisions importantes ont été acheminées via des structures à multiples vérificateurs — parlements, conseils d'administration, panels de juges. À mesure que les LLM entrent dans l'aide à la décision personnelle, cette structure devrait être conservée.

### Pourquoi 3 personas et non 5 ?

Convoquer les 5 à chaque fois est idéal mais coûteux en appels API et en charge cognitive. **3 personas (2 principaux + 1 d'appui)** est la configuration minimale qui préserve les axes opposés tout en restant abordable. JUDGE représente les 2 absents dans un Minority Report, simulant l'envergure des 5.

### Pourquoi les personas ne savent-ils pas qui d'autre a été choisi ?

Si un persona apprend « j'ai été choisi parce que… » ou « X a aussi été choisi », son avis serait inconsciemment renforcé ou affaibli — l'indépendance s'effondrerait. La sélection est fixée avant la délibération mais reste secrète jusqu'à la fin.

### Pourquoi aucune conclusion imposée ?

Cette skill est un **dispositif d'aide à la décision**, pas un **décideur**. La conclusion intégrée de JUDGE est un matériau de référence ; la décision finale vous appartient.

---

## Contraintes connues

- **Dépendance à Claude.ai** : `window.claude.complete()` n'existe que dans l'environnement Artifact de Claude.ai
- **Pas de sélection de modèle** : Claude.ai choisit le modèle
- **Limite supérieure de parallélisme inconnue** : le parallélisme à 3 est testé ; le plafond réel dépend de l'implémentation de Claude.ai
- **Coût API du parallélisme à 3 personas** : 4 appels par délibération (4 sur ~45 dans une fenêtre Pro de 5 h)
- **L'historique du chat est volatile** : les délibérations passées ne sont pas sauvegardées automatiquement (utilisez le mode intensif pour les matérialiser en Artifacts)

---

## Bugs et contributions

Cette skill est une expérience de pensée pour l'aide à la décision personnelle. Les rapports de bugs et propositions d'amélioration sont les bienvenus via GitHub Issues.

---

## Licence

Licence MIT — voir [`LICENSE`](LICENSE).

---

## Documentation associée

| Document | Usage |
|----|----|
| [SKILL.md](SKILL.md) | corps de la skill — cœur de l'implémentation |
| [references/installation.md](references/installation.md) | installation par environnement |
| [references/examples.md](references/examples.md) | exemples d'entrée/sortie |
| [references/customization.md](references/customization.md) | comment personnaliser |
| [references/troubleshooting.md](references/troubleshooting.md) | FAQ / gestion des pannes |
| [CHANGELOG.md](CHANGELOG.md) | historique des révisions |
