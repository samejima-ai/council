# 環境別 導入手順 (v3.1)

このドキュメントは Council SK を各環境で動作させるための手順をまとめたもの。

---

## Claude.ai (chat) での導入

### 方法A: Project機能を使う（推奨）

1. Claude.aiにログイン
2. 新しいProjectを作成（例: "Council Decision Support"）
3. Project Knowledge にこのリポジトリの以下のファイルをアップロード：
   - `SKILL.md`
   - `references/light-mode-format.md`
   - `references/heavy-mode-artifact.md`
   - `references/examples.md`
4. Project の Custom Instructions に以下を記載：
   ```
   このProjectでは Council SK が利用可能である。
   ユーザーが「councilで」「合議して」「多角的に意見が欲しい」等の明示指示をした場合のみ、
   SKILL.md の指示に従って合議制を起動する。
   通常の悩み相談では起動しないこと。
   ```
5. このProject内で「councilで〇〇」と話しかけると起動する

### 方法B: チャット冒頭にSKILL.mdを貼り付ける

1. 新規チャットを開始
2. SKILL.md の全文を貼り付ける
3. 続けて「以上のSKを利用可能とする」と指示
4. 同じチャット内で「councilで〇〇」と話しかける

毎回貼り付けが必要なため、頻繁に使うなら方法Aを推奨。

### 重量モードの利用条件

重量モードは **`window.claude.complete()`** を使用する。Claude.ai Artifact 環境では標準で利用可能。
- ユーザーが「重量で」「Artifactで」と明示指示
- またはClaude判断で深刻度が高いと判定

ボタンを押すと `window.claude.complete()` が4回呼ばれる（3ペルソナ + JUDGE）。
コストはClaude.aiの利用枠内で消費される（実行ユーザーのプラン枠から）。

---

## Claude Code (CC) での導入

### 配置

スキル識別子は `council-jp` （SKILL.md frontmatter の `name`）。Claude Code が認識するディレクトリ名と一致させる。

```bash
# プロジェクトルート直下に .claude/skills/council-jp/ を作成
mkdir -p .claude/skills/council-jp/references
mkdir -p .claude/skills/council-jp/examples

# このリポジトリの内容をコピー
cp SKILL.md .claude/skills/council-jp/
cp -r references/* .claude/skills/council-jp/references/
cp -r examples/* .claude/skills/council-jp/examples/
```

ユーザーグローバルに置く場合：

```bash
git clone https://github.com/samejima-ai/council-jp.git ~/.claude/skills/council-jp
```

### 自動認識

CCはSKを自動認識する。チャット内で起動条件のキーワードを発言すると、
SKILL.mdが読み込まれて合議制が起動する。

### 重量モードの制約

CC環境では `window.claude.complete()` は存在しない。
CCのサブエージェント機能で代替する設計が必要（このSKの守備範囲外）。

CCで運用する場合は **軽量モード推奨**。

---

## Claude API 直叩きでの導入

開発者がClaude APIを使った独自アプリケーションに組み込む場合：

### 軽量モード相当

1. SKILL.md の全文をシステムプロンプトに含める
2. ユーザーメッセージで「councilで〇〇」と送る
3. ClaudeがSKILL.mdに従って3層を演じ分けたテキストを返す

### 重量モード相当

1. 自前で3並列のAPIコールを実装
2. 各コールに該当ペルソナのプロンプトを渡す（`references/heavy-mode-artifact.md` 参照）
3. 3意見が揃ったらJUDGE用APIをコール
4. JUDGE結果をユーザーに表示

`examples/council-heavy-mode.jsx` が React + `window.claude.complete()` での参考実装。
API直叩き版を作る場合は、`window.claude.complete(prompt)` を `anthropic.messages.create({...})` に置き換える。

---

## 必要環境のチェックリスト

### 軽量モードを動かすために必要なもの

- [ ] Claude Sonnet 4 以上のモデルへのアクセス
- [ ] SKILL.md を読み込ませる手段（Project / システムプロンプト / Custom Instructions等）
- [ ] 1万トークン以上のコンテキスト

### 重量モードを動かすために必要なもの

- [ ] 上記の軽量モード要件すべて
- [ ] `window.claude.complete()` が使える環境（= Claude.ai Artifact）
- [ ] React実行環境（参考実装を使う場合）

---

## window.claude.complete() の制約事項

Claude.ai Artifact環境で重量モードを動かす際の前提：

| 項目 | 仕様 |
|------|------|
| 引数 | 文字列1つのみ（system/user分離不可） |
| 戻り値 | Promise<string> |
| モデル指定 | 不可（Claude.ai側が選定） |
| 並列実行 | Promise.allで可能 |
| 課金 | 実行ユーザーのClaude.aiプラン枠 |
| `fetch` 使用 | 不可（CSPで制限される） |

---

## 推奨運用モード

| 利用シーン | 推奨環境 | 推奨モード |
|----------|---------|----------|
| 日常的な悩み相談 | Claude.ai | 軽量 |
| 深刻な人生判断 | Claude.ai | 重量（保存） |
| プロジェクト内の継続的相談 | Claude.ai Project | 軽量主体 |
| 開発環境統合 | Claude Code | 軽量のみ |
| 自社サービス組込 | Claude API直叩き | 両方実装 |

---

## アップグレード方法

新しいバージョンが公開された時の手順：

1. `CHANGELOG.md` で破壊的変更を確認
2. `SKILL.md` を上書き
3. `references/` 以下を上書き
4. 自分でカスタマイズした箇所がある場合、`references/customization.md` を参照して再適用
5. 動作確認は `references/examples.md` の例で実施

### v3.0 → v3.1 のアップグレード時の注意

- API呼び出し方式が `fetch` から `window.claude.complete()` に変更された
- 5ペルソナ全召喚運用は廃止、3ペルソナ動的選定運用に統一
- Artifact参考実装 (`examples/council-heavy-mode.jsx`) を最新版に置き換える必要あり

---

## トラブル時

`references/troubleshooting.md` を参照する。
