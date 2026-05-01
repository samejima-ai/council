<p align="center">
  <strong>日本語</strong> ·
  <a href="README.en.md">English</a> ·
  <a href="README.ko.md">한국어</a> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a>
</p>

<h1 align="center">Council — 合議制意思判断支援SK</h1>

<p align="center">
  <em>3ペルソナ合議制で個人の意思決定を多角的に支援する Claude スキル</em>
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

> ユーザーの単発の迷い・悩み・選択の岐路に対し、テーマ・状況に応じて選定された3ペルソナによる合議制で多角的意見を提示する意思判断支援SK。

**Version**: 3.1 ／ **Target**: Claude.ai (chat) ・ Claude Code ・ その他 Claude SK 対応環境 ／ **API**: `window.claude.complete()` ／ **License**: MIT

> [!NOTE]
> 「Open in Claude.ai」は Claude.ai トップへのショートカットです。ワンクリックインストール機能はまだ存在しないため、初回は下の[クイックスタート](#クイックスタート)に従って Project に SKILL.md を取り込んでください。

---

## このSKは何か

Claudeに悩みを相談すると、通常は1つの応答が返ってくる。便利だが**多角性が失われる**という構造的限界がある。

Council はテーマと状況に応じて選定された **3つの独立した思考様式（5ペルソナの中から動的選定）** による合議を成立させ、最後にJUDGEが統合する。召喚されなかった2ペルソナの視点はJUDGEがマイノリティレポートで代弁する。

**目的**: 結論を押し付けることではない。**ユーザーが自分で納得できる答えを見つけるための材料を提示する**こと。

---

## 主な特徴

- **5ペルソナ候補プール**: 賢者 / 戦略 / 直観 / 反逆 / 凡人
- **動的3ペルソナ選定**: テーマと状況パラメータに応じて窓口層が選定
- **3層アーキテクチャ**: 窓口層 / 合議層 / JUDGE層
- **2モード実装**:
  - 軽量モード: 単一Claude内ロール演技でチャット内に即出力
  - 重量モード: `window.claude.complete()` 経由で**物理的に独立**した3並列実行
- **不在ペルソナの代弁**: 召喚されなかった2名の視点をJUDGEが代弁、5ペルソナ相当の多角性を擬似確保
- **R/R/A評価軸**: Regret（後悔）/ Reversibility（撤回可能性）/ Alignment（価値観整合性）
- **欠席戦略+フォールバック**: API障害時の堅牢な縮退運転
- **コスト効率**: 1合議あたり4回のAPI呼び出し（Claude.ai Pro 5時間枠の約9%）
- **中立性の堅守**: 結論をユーザーに押し付けない設計

---

## 起動方法

ユーザーが以下のいずれかを発言した時のみ起動する：

- 「councilで」「council起動」「council召喚」
- 「合議して」「合議制で」
- 「多角的に意見が欲しい」「いろんな視点で」
- 「Councilメンバーに聞いて」

通常の悩み相談・愚痴・雑談では起動しない（誤起動防止）。

> [!TIP]
> SKILL.md は日本語ですが、Claude のセマンティックマッチングにより英語等で `use the council` / `convene a council` のように依頼してもスキルが起動します。出力言語はユーザーの入力言語に追従します。

---

## ファイル構成

```
council/
├── README.md                          このファイル（日本語・主言語）
├── README.en.md                       English
├── README.ko.md                       한국어
├── README.es.md                       Español
├── README.fr.md                       Français
├── SKILL.md                           SKの本体（必須読み込み対象）
├── LICENSE                            MITライセンス
├── CHANGELOG.md                       改訂履歴
├── references/
│   ├── light-mode-format.md           軽量モードの出力フォーマット仕様
│   ├── heavy-mode-artifact.md         重量モードのArtifact実装ガイド
│   ├── examples.md                    入出力例
│   ├── installation.md                環境別の導入手順
│   ├── customization.md               カスタマイズガイド
│   └── troubleshooting.md             FAQ・障害対応
└── examples/
    └── council-heavy-mode.jsx         重量モード参考実装（React）
```

---

## クイックスタート

### Claude.ai を使っている場合

1. [Claude.ai](https://claude.ai) にログイン
2. 新しいProjectを作成
3. Project Knowledge にこのリポジトリのファイルをアップロード（最低でもSKILL.md + references/）
4. Project の Custom Instructions に Council SK が利用可能と明記
5. このProject内で「councilで〇〇について相談したい」と話しかける

### Claude Code を使っている場合

```bash
# 1. リポジトリをクローン
git clone https://github.com/samejima-ai/council.git ~/.claude/skills/council

# 2. Claude Code を起動して「councilで〇〇」と話しかける（自動認識される）
```

または プロジェクトローカルに置く場合は `<project>/.claude/skills/council/` 以下に配置。

詳細は [`references/installation.md`](references/installation.md) を参照。

---

## 想定するユースケース

| 適用 | ✅ |
|-----|---|
| キャリア選択（転職・進学・独立・撤退） | ✅ |
| 人間関係（恋愛・友人関係・職場関係） | ✅ |
| 創造的挑戦（アート・起業・新規事業） | ✅ |
| 金銭判断（投資・大型購入・住居） | ✅ |
| 倫理的葛藤（家族責任・道徳的選択） | ✅ |
| 停滞打破（マンネリ・現状脱却） | ✅ |

| 想定外 | ❌ |
|-------|---|
| 開発・実装の技術判断 | ❌ 別SK推奨 |
| 他人の代理意思決定 | ❌ 当事者性が必要 |
| 緊急性が極めて高い判断（命に関わる等） | ❌ 専門機関推奨 |
| 事実確認・情報検索 | ❌ web検索等を使うべき |

---

## 思想的背景

### なぜ「合議制」なのか

人間の意思決定は**単一視点では盲点が必ず残る**。
歴史的に重要な判断は議会・取締役会・裁判官合議など、複数視点による検証構造を持ってきた。
LLMが個人の意思決定支援に入る時、この構造を引き継ぐべきという考えに基づく。

### なぜ「3ペルソナ」なのか

5ペルソナ全員召喚は理想だが、API呼び出し回数とユーザー認知負荷が大きい。
**3名（主軸2 + 補助1）**は対立軸を保ちつつコスパを実現する最小構成。

不在2名はJUDGEが代弁することで、5ペルソナ相当の多角性を擬似的に確保する。

### なぜ「選定理由はペルソナに非開示」なのか

ペルソナが「自分が選ばれた理由・他に誰が選ばれたか」を知ると意見が無意識に強化／弱化され、独立性が崩壊する。
選定情報は合議前に確定するが、合議が終わるまでペルソナには明かさない。

### なぜ「結論を押し付けない」のか

このSKは**意思決定支援装置**であり**意思決定者**ではない。
JUDGE層の統合結論はあくまで参考であり、最終決定はユーザー自身が行う。

---

## 既知の制約

- **Claude.ai 依存**: `window.claude.complete()` は Claude.ai Artifact 環境専用
- **モデル指定不可**: Claude.ai 側が選定したモデルで実行される
- **API並列の上限不明**: 3並列はテスト確認済みだが、上限はClaude.aiの実装に依存
- **3ペルソナ並列の API コスト**: 1合議で4回のAPI呼び出し（Pro 5時間枠約45のうち4消費）
- **チャット履歴の揮発性**: 過去の合議結果は自動保存されない（必要なら重量モードでArtifact化）

---

## バグ報告・貢献

このSKは個人意思決定支援を目的とした思想実験である。バグや改善提案は歓迎する。GitHub Issues 経由で連絡してください。

---

## ライセンス

MIT License — [`LICENSE`](LICENSE) ファイルを参照。

---

## 関連ドキュメント

| ドキュメント | 用途 |
|------------|------|
| [SKILL.md](SKILL.md) | SK本体・実装の中核 |
| [references/installation.md](references/installation.md) | 環境別導入手順 |
| [references/examples.md](references/examples.md) | 入出力例 |
| [references/customization.md](references/customization.md) | カスタマイズ方法 |
| [references/troubleshooting.md](references/troubleshooting.md) | FAQ・障害対応 |
| [CHANGELOG.md](CHANGELOG.md) | 改訂履歴 |
