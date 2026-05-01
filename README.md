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
  <a href="https://codespaces.new/samejima-ai/council-jp"><img src="https://github.com/codespaces/badge.svg" alt="Open in GitHub Codespaces"></a>
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
git clone https://github.com/samejima-ai/council-jp.git ~/.claude/skills/council-jp

# 2. Claude Code を起動して「councilで〇〇」と話しかける（自動認識される）
```

または プロジェクトローカルに置く場合は `<project>/.claude/skills/council-jp/` 以下に配置。

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

### 使用例（具体的なプロンプト）

ユーザーが Claude に投げる例：

```
councilで 30歳での転職について相談したい。
今の会社は安定してるけど、もっと成長を感じたい気持ちがある。
ただし家族がいてリスクは取りすぎたくない。
```

```
合議して欲しい。同棲中の恋人と価値観のズレを感じる。
別れるべきか、もう少し続けるべきか分からない。
```

```
多角的に意見が欲しい。投資で得た300万を、起業資金にするか
住宅ローン繰上返済に使うか、迷っている。
```

```
councilで考えて。親の介護で実家近くへ引っ越す圧力があるが、
仕事のキャリアと両立できるか不安。
```

トリガーは日本語の「councilで」「合議して」等のほか、英語で `use the council to...` でも発火します（Claude のセマンティックマッチング）。

---

## 類似スキルとの違い

「合議制 / Multi-Persona Council」は Claude スキルでも参入が増えている領域。Council SK (`council-jp`) を選ぶ理由を正直に整理する。

### このスペースで一般的な傾向

- 7〜18 名の固定ペルソナを毎回フル召喚
- 主用途は技術判断（コードレビュー / アーキテクチャ / 戦略決定）
- "Verdict"（評決）を出す
- Claude Code のサブエージェント機能で並列実行
- 英語ファースト

### Council SK のポジション

| 軸 | 一般的なアプローチ | Council SK (`council-jp`) |
|---|---|---|
| ペルソナ選定 | N人固定召喚 | **5プールから3動的選定**（テーマ・状況依存） |
| 主用途 | 技術判断中心 | **個人の人生判断**（キャリア・人間関係・金銭・倫理） |
| 結論スタンス | 評決を提示 | **中立堅持**（押し付けない） |
| 独立性保全 | 通常は考慮されない | **盲選定**（誰が他に選ばれたかを当人に伏せる） |
| 実行モード | 単一モード | **軽量＋重量の二モード**（重量は Claude.ai Artifact で物理独立並列） |
| 評価軸 | 自由形式 | **R/R/A**（Regret / Reversibility / Alignment） |
| 不在ペルソナ | 切り捨て | **JUDGE が代弁**（マイノリティレポート） |
| 主言語 | 英語 | **日本語ファースト**（多言語 README で導線） |

### 関連プロジェクト（参考）

- [itshussainsprojects/Claude-Council-Skill](https://github.com/itshussainsprojects/Claude-Council-Skill) — 7名固定、個人意思決定向け（思想が最も近い）
- [0xNyk/council-of-high-intelligence](https://github.com/0xNyk/council-of-high-intelligence) — 18名固定、Aristotle / Feynman / Kahneman 等、マルチ LLM プロバイダ
- [tsenart/council-skill](https://github.com/tsenart/council-skill) — Codex / Claude Code / Amp 横断ポータブル council
- [wan-huiyan/agent-review-panel](https://github.com/wan-huiyan/agent-review-panel) — コード/プランレビュー特化の adversarial panel

このスペースは活発で競合は今後も増える。Council SK (`council-jp`) が差別化を主張できるのは **「個人の人生判断 × 中立堅持 × 二モード × 日本語ファースト」** の組み合わせ。

---

## 思想的背景

### 設計哲学 — なぜ「偏った少数」なのか

合議は、**特性を絞った最小数**で行うべきだ。

必要なのは**偏った意見による合議**であって、多数決ではない。

人間の合議は、複数人が衆知を持ち寄り多数決で結晶化させる仕組みである。しかし AI にこの構造をそのまま当てはめても、最良の答えは引き出せない。

**AI から最良を引き出すのは、凝縮された偏った視点を真正面からぶつけ、止揚（アウフヘーベン）させるプロセスである** ── これが Council SK の中核仮説である。

だから Council SK は「多数のペルソナを並べて合意を取る」設計を採らない。「**少数の鋭い視点を意図的に対立させ、JUDGE に止揚させる**」設計を採る。

5 プールから 3 名（主軸 2 + 補助 1）／ 盲選定 ／ R/R/A 評価 ── これらすべては、この一つの仮説から導かれている。

### なぜ「合議制」なのか

人間の意思決定は**単一視点では盲点が必ず残る**。
歴史的に重要な判断は議会・取締役会・裁判官合議など、複数視点による検証構造を持ってきた。
LLMが個人の意思決定支援に入る時、この構造を引き継ぐべきという考えに基づく。

ただし AI における合議は人間のそれとは構造的に異なる ── 上記「設計哲学」を参照。

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
