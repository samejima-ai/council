# Changelog

## v3.1.1 (現行・公開向け整備)

### スキル識別子のリネーム

- **`name: council` → `name: council-jp`**
  - 「council」「Multi-Persona Council」系の競合スキルが多数存在するため、識別子を `council-jp` に変更して衝突回避
  - 表示名「Council」「Council SK」は維持
  - 起動トリガー（「councilで」「合議して」等）は変更なし
  - インストールパスは `~/.claude/skills/council-jp/` を推奨に

### README 拡充（公開導線整備）

- ヒーロー部に shields.io バッジ・「Open in Claude.ai」「Open in GitHub Codespaces」ボタン・言語スイッチャーを追加
- 多言語 README（英・韓・西・仏）を新設
- 「使用例（具体的なプロンプト）」サブセクションを追加（実投入例 4 種）
- **「類似スキルとの違い」セクション**を新設（典型的アプローチとの差分を表で整理、関連プロジェクト紹介）
- **設計哲学「なぜ "偏った少数" なのか」**を `思想的背景` の冒頭に追加
  - 中核仮説：AI から最良を引き出すのは凝縮された偏った視点の止揚（アウフヘーベン）
  - 旧「なぜ3ペルソナ」（コスト的説明）は本サブセクションに吸収
- `.gitignore` に `.claude/`（harness 生成物）を追加

---

## v3.1

### 設計の根本的見直し

- **5ペルソナ全召喚運用を廃止し、3ペルソナ動的選定運用に移行**
  - 候補プールは5ペルソナのまま（賢者・戦略・直観・反逆・凡人）
  - テーマと状況パラメータに応じて窓口層が3名（主軸2+補助1）を選定
  - 不在2名はJUDGEがペルソナ定義に基づいて代弁することで多角性を擬似的に確保
- **API呼び出しを `fetch` から `window.claude.complete()` に全面移行**
  - Claude.ai のCSPで `fetch` が実質ブロックされる問題を解消
  - 規約準拠のAPIアクセス手段に統一
  - 1合議あたり4回（3ペルソナ + JUDGE）に削減（v3.0の6回から33%削減）
- **マイノリティレポートの2分化**
  - 召喚3名内のマイノリティ（従来通り）
  - 不在2名の代弁（新規。JUDGEが想像で代弁）
- **欠席戦略の閾値変更**
  - フォールバック条件: 召喚3名のうち2名以上欠席で軽量モード降格（v3.0は5名のうち3名以上）

### ドキュメント更新

- README.md: 3ペルソナ運用、`window.claude.complete()` 仕様を反映
- SKILL.md: 中核設計を3ペルソナ前提で再構築
- references/heavy-mode-artifact.md: 全面書き換え
- references/light-mode-format.md: 3ペルソナ + 不在代弁仕様
- references/examples.md: 例を3ペルソナベースに改訂
- references/installation.md: window.claude.complete() 制約を明記
- references/troubleshooting.md: 既知制約を刷新
- references/customization.md: 5ペルソナ廃止に伴う調整
- examples/council-heavy-mode.jsx: 全面書き換え

---

## v3.0

### 設計

- 重み付けの非開示原則を確立（ペルソナの独立性を保護）
- 欠席戦略の厳格化（API障害ペルソナの意見をJUDGE入力から完全除外）
- フォールバック条件の明示（5ペルソナのうち3名以上欠席で軽量モード降格）

### 配布化

- README.md / LICENSE / CHANGELOG.md 追加
- references/examples.md / installation.md / customization.md / troubleshooting.md 追加
- examples/council-heavy-mode.jsx に参考実装を同梱

---

## v2.0

- ハイブリッド実装の導入（軽量=単一Claude演技 / 重量=Artifact内API並列）
- 部分独立の定義（他ペルソナ意見を渡さない）
- references/heavy-mode-artifact.md を分離

---

## v1.0

- 初版
- 5ペルソナ定義（賢者・戦略・直観・反逆・凡人）
- 3層アーキテクチャ（窓口/合議/JUDGE）
- 単一Claude内ロール演技による合議制
- テーマ別重み付けマトリクス
- R/R/A評価軸の導入
- マイノリティレポート機構
