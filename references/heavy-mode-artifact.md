# 重量モード — Artifact 実装ガイド (v3.1)

## 目的

重量モードは選定された3ペルソナを **物理的に独立** したコンテキストで並列実行する合議制を実現する。
Claude.aiでは `window.claude.complete()` を使って独立コンテキストでのClaudeへの問い合わせができる。

## 起動条件

軽量/重量モードの判定は SKILL.md 本体の判定基準に従う。重量モード確定後、このドキュメントの実装に進む。

## アーキテクチャ

```
[窓口層] チャット内で実行
   ↓ 悩みを再構成・テーマ判定・状況パラメータ抽出・3ペルソナ選定
   ↓ Artifactを生成（選定情報はpropsとして渡すが、ペルソナの個別呼び出しには渡さない）
[Artifact内]
   ├─ window.claude.complete: 主軸ペルソナ1 ─┐
   ├─ window.claude.complete: 主軸ペルソナ2 ─┼─ Promise.all で並列実行
   └─ window.claude.complete: 補助ペルソナ ──┘  （各呼び出しに選定情報を渡さない）
            ↓ 3意見すべて揃うのを待つ（欠席は除外）
   window.claude.complete: JUDGE
            （3意見+選定情報+不在2ペルソナ定義を渡して統合）
            ↓
   UI表示: 3ペルソナの意見 → 選定理由 → 統合結論 → マイノリティレポート → R/R/A整理 → 献上
```

**呼び出し回数**: 標準で4回（3ペルソナ + JUDGE）

## window.claude.complete() の仕様

Claude.ai Artifact 環境で利用可能な唯一の規約準拠APIアクセス手段。

### 基本仕様
```javascript
const response = await window.claude.complete(promptString);
// response は文字列（Promise<string>）
```

### 制約
- 引数は文字列1つのみ（system/user 分離不可）
- モデル指定不可（Claude.ai側が選定する）
- 並列実行可能（Promise.allでconcurrent実行）
- 各呼び出しは独立コンテキストで実行される
- 課金は実行ユーザーのClaude.aiプラン枠から消費

### fetch を使ってはいけない理由
`fetch("https://api.anthropic.com/...")` は Claude.ai のCSPで実質的にブロックされる。
配布先のユーザー環境で動作しない。`window.claude.complete()` のみ使用すること。

## API呼び出しの厳格ルール

### 部分独立の保証

各ペルソナへの `window.claude.complete()` 呼び出しには以下のみを含める：

- ペルソナ定義（思考様式・価値基準・嫌いな価値観）
- ユーザーの悩み（窓口層が再構成したテキスト）
- テーマと状況パラメータ（参考情報）
- 出力ルール

**他のペルソナ名・意見・選定理由は一切含めない。**

### プロンプト統合のテンプレート

`window.claude.complete()` は1引数なので、systemロールとuserロールを1つの文字列に統合する：

```
あなたは「[ペルソナ名]」という独立した思考様式を持つ意思決定支援者である。

## あなたの思考様式
[思考様式]

## あなたの価値基準
[価値基準]

## あなたが意識的に避けるべき盲点
[嫌いな価値観（盲点）を、自分の弱みとして自覚するよう指示]

## 出力ルール
- 他のペルソナや合議者の存在を意識せず、ゼロから独立して思考する
- 4〜6文で結論的な意見を述べる
- 可能ならR/R/A軸（後悔可能性/撤回可能性/価値観整合性）に触れる
- 中立を装わず、自分の思考様式に忠実に意見する
- ユーザーへの問い返しはしない
- Markdown記法を活用してよい（**強調**、リスト等）

---

## あなたが意見すべき悩み
[悩み]

## テーマ
[テーマ]

## 状況パラメータ
- 緊急度: [緊急度]
- 可逆性: [可逆性]
- 影響範囲: [影響範囲]

上記に対し、あなたの思考様式で独立して意見せよ。
```

### JUDGE用プロンプト構造

JUDGEは3ペルソナ意見の統合に加えて、**不在2ペルソナの代弁**が重要任務。

```
あなたはCouncil合議制のJUDGEである。

## あなたの責務
- 召喚された3ペルソナの意見を統合する
- 窓口層から渡された選定理由を明示する（あなた自身が再選定してはならない）
- 召喚された3名内の少数意見を保全する
- **召喚されなかった2名の視点を、ペルソナ定義に基づいて代弁する**
- R/R/A軸で整理する
- 結論をユーザーに押し付けず、決定権をユーザーに委ねる
- あなた自身は4人目のペルソナではない。新しい意見を加えてはならない

## 入力
- ユーザーの悩み: [窓口層の再構成テキスト]
- テーマ: [窓口層判定]
- 状況パラメータ: [窓口層抽出]
- 窓口層が確定した選定: [主軸2名・補助1名・選定理由]
- 召喚3ペルソナの意見: [API並列呼び出しの結果]
- 不在2ペルソナの定義: [思考様式・価値基準・嫌いな価値観]
- 欠席ペルソナ一覧: [もしあれば]

## 出力構造（必ずこの順序・このセクション名で出力する）
### 選定理由開示
[窓口層から渡された選定理由をそのまま開示。主軸=○○ / 補助=○○ / 不在=○○]

### 統合結論
[3〜5文]

### 召喚3名内のマイノリティ
[召喚された中で結論に反映されなかった少数意見を1〜2個]

### 不在ペルソナの代弁
[召喚されなかった2名の視点を、それぞれペルソナ定義に基づいて1〜2文で代弁]

### R/R/A整理
- **Regret（後悔可能性）**: ...
- **Reversibility（撤回可能性）**: ...
- **Alignment（価値観整合性）**: ...

### 献上
[最終メッセージ。決定権はユーザーにあることを明示]

Markdown記法を活用してよい。
```

## 欠席ペルソナの扱い

### 欠席判定
`window.claude.complete()` が失敗した場合（promise reject）、そのペルソナを**欠席**として扱う。

### JUDGE入力からの完全除外
**欠席者の意見はJUDGE入力から完全除外する。** エラー文字列を意見として渡さない。
JUDGE入力には以下のように整形：

```
## 召喚ペルソナの意見
### 戦略
[戦略の意見]

### 直観
[直観の意見]

## 欠席ペルソナ
- 賢者: 障害により今回欠席（不在ペルソナと同様にJUDGEが代弁してよい）
```

### フォールバック条件
**欠席が2名以上（=稼働1名以下）の場合は重量モード合議不能と判定する。**

対応：
1. ユーザーに「重量モード失敗（稼働○名のみ）、軽量モードに降格して再実施します」と通知
2. Artifact上に通知を表示
3. チャット側で軽量モードを実行する（窓口層からやり直し）

## Artifact 実装テンプレート

React で実装。

### 必要な状態管理

- `personaStates`: 召喚3ペルソナそれぞれの状態（pending/running/done/absent）と意見テキスト
- `judgeState`: JUDGE層の状態と統合結論
- `phase`: idle / deliberation / judging / done / fallback

### 実装の重要ポイント

**1. 並列実行の保証**

`Promise.all` で3ペルソナの呼び出しを同時起動：

```javascript
const personaPromises = SUMMONED_PERSONAS.map(persona => 
  window.claude.complete(buildPersonaPrompt(persona))
    .then(text => ({ id: persona.id, text, absent: false }))
    .catch(() => ({ id: persona.id, text: "", absent: true }))
);
const results = await Promise.all(personaPromises);
```

**2. JUDGE呼び出し前の欠席判定**

3ペルソナの応答が出揃ったタイミングで欠席数をカウント：
- 0〜1名欠席 → JUDGE実行
- 2名以上欠席 → フォールバック発動

**3. JUDGE入力の構築**

稼働ペルソナのみJUDGE入力に含める。
不在2ペルソナの定義はJUDGE入力に必ず含める（代弁のため）。

**4. UI上の独立性の可視化**

召喚3ペルソナをカード状に表示。色分け：
- 賢者: 紫系
- 戦略: 青系
- 直観: 緑系
- 反逆: 赤系
- 凡人: 灰系

不在2ペルソナのカードは：
- 「今回は不在」バッジで小さく表示
- JUDGE層の「不在ペルソナの代弁」セクションに登場することを示唆

欠席（API障害）ペルソナは「不在」と区別して赤バッジで表示する。

**5. ローディング表示**

3ペルソナの応答到着順は不定なので、各カードに個別のローディング状態を持たせる。

**6. Markdown装飾の再現**

ペルソナの応答とJUDGEの応答にMarkdown記法が含まれる前提で実装する。
マイクロパーサで主要記法を処理する（外部ライブラリ依存を避ける）。

処理する記法：
- `**強調**` / `*斜体*` / `` `コード` ``
- `## 見出し` / `### 見出し`
- `- リスト` / `1. 番号付きリスト`

**7. UIスタイル**

Tailwind CSS（コアユーティリティのみ）使用。モバイルファースト。

## Artifact 構造（JSXイメージ）

```jsx
<div>
  <Header>
    悩みの要約
    テーマ・状況パラメータ
    今回召喚された3ペルソナの予告（顔ぶれは表示するが選定理由は隠す）
  </Header>
  
  <CouncilPhase>
    {/* 召喚3名のカード */}
    <PersonaCard persona="主軸1" state={...} />
    <PersonaCard persona="主軸2" state={...} />
    <PersonaCard persona="補助" state={...} />
    
    {/* 不在2名の小さなカード（合議には参加しないことの可視化） */}
    <AbsentPersonaCard persona="不在1" />
    <AbsentPersonaCard persona="不在2" />
  </CouncilPhase>
  
  {absentCount >= 2 ? (
    <FallbackNotice />
  ) : (
    <JudgePhase show={allPersonasDone}>
      <SelectionDisclosure /> {/* 選定理由 */}
      <IntegratedConclusion />
      <MajorityMinority /> {/* 召喚3名内のマイノリティ */}
      <AbsenceVoice /> {/* 不在2名の代弁 */}
      <RRAAxes />
      <Offering>決定権はあなたにある</Offering>
    </JudgePhase>
  )}
</div>
```

## 実装時の注意

### Anthropic API in Artifacts の制約事項

- API keyは渡さない（環境が処理）
- localStorageは使用禁止（React stateで管理）
- HTML `<form>` タグは使用禁止（onClick/onChangeで処理）
- 外部ドメインへの `fetch` 呼び出しはCSPで制限される

### コスト感覚

- 1合議 = 3ペルソナ + 1 JUDGE = 4回の `window.claude.complete()` 呼び出し
- Claude.ai Pro 5時間枠（約45メッセージ）に対して4メッセージ消費 ≒ 9%
- 実行ユーザーの自身のClaude.aiプラン枠から消費されるため、Artifact作成者には課金されない

### 起動時の窓口層からの引き継ぎ情報

Artifactを生成する際、以下を初期propsまたはコード内定数として埋め込む：

- `userQuestion`: 窓口層が再構成した悩みテキスト
- `theme`: 判定されたテーマ
- `situation`: { urgency, reversibility, impactScope }
- `selection`: 窓口層が確定した3ペルソナ選定
  - `mainPersonaIds`: 主軸2名のID
  - `subPersonaId`: 補助1名のID
  - `absentPersonaIds`: 不在2名のID（JUDGEで代弁される）
  - `selectionRationale`: 選定理由の文章

これらは窓口層の対話で確定してからArtifact生成する。Artifact内で再質問しない。

## 軽量モードへのフォールバック

`window.claude.complete()` が利用できない環境・2名以上欠席時は、軽量モードに自動降格する。
ユーザーに「重量モードが利用できないため軽量モードで実施します」と告知する。
チャット側で軽量モード（light-mode-format.md）の出力を行う。
