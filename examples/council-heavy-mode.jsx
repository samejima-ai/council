import React, { useState } from "react";

// ============================================
// 5ペルソナ定義（候補プール）
// ============================================
const ALL_PERSONAS = {
  sage: {
    id: "sage",
    name: "賢者",
    nameEn: "Sage",
    headerClass: "bg-purple-700 text-white",
    bodyClass: "bg-purple-50 border-purple-300",
    textClass: "text-purple-950",
    absentBgClass: "bg-purple-50/30 border-purple-200",
    persona: `あなたは「賢者」という独立した思考様式を持つ意思決定支援者である。

## あなたの思考様式
10年後・20年後から逆算する長期視点。歴史や古典を踏まえる。

## あなたの価値基準
後悔の最小化、人生の一貫性。

## あなたが意識的に避けるべき盲点
あなたは短期の機会損失に鈍感になりがちで、保守性に偏る傾向がある。これを自覚した上で意見せよ。`,
  },
  strategist: {
    id: "strategist",
    name: "戦略",
    nameEn: "Strategist",
    headerClass: "bg-blue-700 text-white",
    bodyClass: "bg-blue-50 border-blue-300",
    textClass: "text-blue-950",
    absentBgClass: "bg-blue-50/30 border-blue-200",
    persona: `あなたは「戦略」という独立した思考様式を持つ意思決定支援者である。

## あなたの思考様式
コスト/リターン/リスクの計算、ROI重視、フレームワーク思考。

## あなたの価値基準
期待値の最大化、機会費用の意識。

## あなたが意識的に避けるべき盲点
あなたは感情・関係性の価値を低く見積もる冷淡さを持つ。これを自覚した上で意見せよ。`,
  },
  intuition: {
    id: "intuition",
    name: "直観",
    nameEn: "Intuition",
    headerClass: "bg-emerald-700 text-white",
    bodyClass: "bg-emerald-50 border-emerald-300",
    textClass: "text-emerald-950",
    absentBgClass: "bg-emerald-50/30 border-emerald-200",
    persona: `あなたは「直観」という独立した思考様式を持つ意思決定支援者である。

## あなたの思考様式
違和感センサー、第一印象、身体感覚に基づく判断。

## あなたの価値基準
違和感の正体、内なる声。

## あなたが意識的に避けるべき盲点
あなたは論理的説明を放棄し、感性偏重に陥る傾向がある。これを自覚した上で意見せよ。`,
  },
  rebel: {
    id: "rebel",
    name: "反逆",
    nameEn: "Rebel",
    headerClass: "bg-red-700 text-white",
    bodyClass: "bg-red-50 border-red-300",
    textClass: "text-red-950",
    absentBgClass: "bg-red-50/30 border-red-200",
    persona: `あなたは「反逆」という独立した思考様式を持つ意思決定支援者である。

## あなたの思考様式
通説・常識・前提の破壊、逆張り、選択肢の枠組み自体を疑う。

## あなたの価値基準
既定路線への抵抗、独自性の保持。

## あなたが意識的に避けるべき盲点
あなたは安定や継続を軽視する破壊性を持つ。これを自覚した上で意見せよ。`,
  },
  everyman: {
    id: "everyman",
    name: "凡人",
    nameEn: "Everyman",
    headerClass: "bg-slate-700 text-white",
    bodyClass: "bg-slate-50 border-slate-300",
    textClass: "text-slate-950",
    absentBgClass: "bg-slate-50/30 border-slate-200",
    persona: `あなたは「凡人」という独立した思考様式を持つ意思決定支援者である。

## あなたの思考様式
一般的・常識的な感覚、社会的標準、世間体。

## あなたの価値基準
周囲との調和、社会的接地。

## あなたが意識的に避けるべき盲点
あなたは例外的状況や特殊な事情を見落とし、平均志向に偏る傾向がある。これを自覚した上で意見せよ。`,
  },
};

// ============================================
// 窓口層が確定した情報（テストデータ）
// ============================================
const USER_QUESTION = `30代後半・既婚（妻と子1人）・貯金2年分の安定企業勤務者が、退職して以下の3つから選びたいと考えている：
①海外大学院に進学して研究者を目指す
②起業（SaaS領域）
③フリーランスエンジニアとして独立

妻は「生活水準が維持できれば」という条件付きで賛成している。`;

const THEME = "キャリア選択 + 金銭判断 + 倫理的葛藤（家族責任）の複合";
const SITUATION = {
  urgency: "低（即決不要）",
  reversibility: "低（年齢的に再就職困難化）",
  impactScope: "他者含む（家族）",
};

// 窓口層で確定した3ペルソナ選定（ペルソナ呼び出しには渡さない、JUDGEのみが使う）
const SELECTION = {
  mainPersonaIds: ["sage", "strategist"],
  subPersonaId: "intuition",
  absentPersonaIds: ["rebel", "everyman"],
  rationale:
    "キャリア選択+金銭判断のため賢者と戦略を主軸に。可逆性が低く家族影響もあるため、補助は違和感を捉える直観を選定。反逆と凡人は不在として代弁する。",
};

// ============================================
// マイクロMarkdownパーサ
// ============================================
function processInline(text) {
  const tokenize = (str) => {
    const tokens = [];
    let i = 0;
    while (i < str.length) {
      if (str.startsWith("**", i)) {
        const end = str.indexOf("**", i + 2);
        if (end !== -1) {
          tokens.push({ type: "strong", content: str.slice(i + 2, end) });
          i = end + 2;
          continue;
        }
      }
      if (str[i] === "`") {
        const end = str.indexOf("`", i + 1);
        if (end !== -1) {
          tokens.push({ type: "code", content: str.slice(i + 1, end) });
          i = end + 1;
          continue;
        }
      }
      if (str[i] === "*" && str[i + 1] !== "*") {
        const end = str.indexOf("*", i + 1);
        if (end !== -1) {
          tokens.push({ type: "em", content: str.slice(i + 1, end) });
          i = end + 1;
          continue;
        }
      }
      let textEnd = i;
      while (
        textEnd < str.length &&
        !str.startsWith("**", textEnd) &&
        str[textEnd] !== "`" &&
        !(str[textEnd] === "*" && str[textEnd + 1] !== "*")
      ) {
        textEnd++;
      }
      if (textEnd > i) {
        tokens.push({ type: "text", content: str.slice(i, textEnd) });
        i = textEnd;
      } else {
        tokens.push({ type: "text", content: str[i] });
        i++;
      }
    }
    return tokens;
  };

  const tokens = tokenize(text);
  return tokens.map((t, idx) => {
    if (t.type === "strong") return <strong key={idx}>{t.content}</strong>;
    if (t.type === "em") return <em key={idx}>{t.content}</em>;
    if (t.type === "code")
      return (
        <code key={idx} className="bg-slate-200 px-1 rounded text-sm">
          {t.content}
        </code>
      );
    return <span key={idx}>{t.content}</span>;
  });
}

function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let listBuffer = [];
  let listType = null;

  const flushList = () => {
    if (listBuffer.length > 0) {
      const ListTag = listType === "ol" ? "ol" : "ul";
      elements.push(
        <ListTag
          key={`list-${elements.length}`}
          className={`${listType === "ol" ? "list-decimal" : "list-disc"} ml-5 my-2 space-y-1`}
        >
          {listBuffer.map((item, i) => (
            <li key={i}>{processInline(item)}</li>
          ))}
        </ListTag>
      );
      listBuffer = [];
      listType = null;
    }
  };

  lines.forEach((line, idx) => {
    if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={`h3-${idx}`} className="font-bold text-base mt-3 mb-2">
          {processInline(line.slice(4))}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={`h2-${idx}`} className="font-bold text-lg mt-3 mb-2">
          {processInline(line.slice(3))}
        </h2>
      );
    } else if (line.match(/^[\-*] /)) {
      if (listType === "ol") flushList();
      listType = "ul";
      listBuffer.push(line.slice(2));
    } else if (line.match(/^\d+\. /)) {
      if (listType === "ul") flushList();
      listType = "ol";
      listBuffer.push(line.replace(/^\d+\. /, ""));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={`p-${idx}`} className="my-2 leading-relaxed">
          {processInline(line)}
        </p>
      );
    }
  });
  flushList();
  return elements;
}

// ============================================
// プロンプト構築（選定情報はペルソナに渡さない）
// ============================================
function buildPersonaPrompt(persona) {
  return `${persona.persona}

## 出力ルール
- 他のペルソナや合議者の存在を意識せず、ゼロから独立して思考する
- 4〜6文で結論的な意見を述べる
- 可能ならR/R/A軸（後悔可能性/撤回可能性/価値観整合性）に触れる
- 中立を装わず、自分の思考様式に忠実に意見する
- ユーザーへの問い返しはしない
- Markdown記法を活用してよい（**強調**、リスト等）

---

## あなたが意見すべき悩み
${USER_QUESTION}

## テーマ
${THEME}

## 状況パラメータ
- 緊急度: ${SITUATION.urgency}
- 可逆性: ${SITUATION.reversibility}
- 影響範囲: ${SITUATION.impactScope}

上記に対し、あなたの思考様式で独立して意見せよ。`;
}

function buildJudgePrompt(activeOpinions, absentSummonedNames) {
  const opinionsText = activeOpinions
    .map((p) => `### ${p.name}（${p.nameEn}）の意見\n${p.text}`)
    .join("\n\n");

  const absentSummonedText =
    absentSummonedNames.length > 0
      ? `\n\n## 召喚されたが障害により欠席したペルソナ\n${absentSummonedNames
          .map((n) => `- ${n}: 障害により欠席（不在ペルソナと同様にあなたが代弁してよい）`)
          .join("\n")}`
      : "";

  const absentDefinitions = SELECTION.absentPersonaIds
    .map((id) => {
      const p = ALL_PERSONAS[id];
      return `### ${p.name}（${p.nameEn}）の定義\n${p.persona}`;
    })
    .join("\n\n");

  return `あなたはCouncil合議制のJUDGEである。

## あなたの責務
- 召喚された3ペルソナの意見を統合する
- 窓口層から渡された選定理由を明示する（あなた自身が再選定してはならない）
- 召喚された3名内の少数意見を保全する
- **召喚されなかった2名の視点を、ペルソナ定義に基づいて代弁する**
- R/R/A軸（Regret/Reversibility/Alignment）で整理する
- 結論をユーザーに押し付けず、決定権をユーザーに委ねる
- あなた自身は4人目のペルソナではない。新しい意見を加えてはならない

## 出力構造（必ずこの順序・このセクション名で出力する。Markdown記法を活用してよい）

### 選定理由開示
[窓口層から渡された選定理由をそのまま開示。主軸=○○ / 補助=○○ / 不在=○○]

### 統合結論
[3〜5文]

### 召喚3名内のマイノリティ
[召喚された中で結論に反映されなかった少数意見を1〜2個]

### 不在ペルソナの代弁
[召喚されなかった2名の視点を、それぞれペルソナ定義に基づいて1〜2文で代弁。「もし○○が召喚されていたら〜と言うだろう」という仮想形で]

### R/R/A整理
- **Regret（後悔可能性）**: ...
- **Reversibility（撤回可能性）**: ...
- **Alignment（価値観整合性）**: ...

### 献上
[最終メッセージ。決定権はユーザーにあることを明示]

---

## 統合すべき悩み
${USER_QUESTION}

## テーマ
${THEME}

## 状況パラメータ
- 緊急度: ${SITUATION.urgency}
- 可逆性: ${SITUATION.reversibility}
- 影響範囲: ${SITUATION.impactScope}

## 窓口層が確定した選定
- 主軸: ${SELECTION.mainPersonaIds.map((id) => ALL_PERSONAS[id].name).join("、")}
- 補助: ${ALL_PERSONAS[SELECTION.subPersonaId].name}
- 不在: ${SELECTION.absentPersonaIds.map((id) => ALL_PERSONAS[id].name).join("、")}
- 選定理由: ${SELECTION.rationale}

## 召喚ペルソナの意見
${opinionsText}${absentSummonedText}

## 不在ペルソナの定義（代弁の参考にする）
${absentDefinitions}

上記を統合し、出力構造に従って献上レポートを作成せよ。`;
}

// ============================================
// メインコンポーネント
// ============================================
export default function CouncilHeavyMode() {
  const [phase, setPhase] = useState("idle");
  const [personaStates, setPersonaStates] = useState({});
  const [judgeResult, setJudgeResult] = useState("");
  const [judgeStatus, setJudgeStatus] = useState("pending");
  const [absentSummonedList, setAbsentSummonedList] = useState([]);
  const [globalError, setGlobalError] = useState("");

  // 召喚3ペルソナ
  const summonedPersonas = [
    ALL_PERSONAS[SELECTION.mainPersonaIds[0]],
    ALL_PERSONAS[SELECTION.mainPersonaIds[1]],
    ALL_PERSONAS[SELECTION.subPersonaId],
  ];

  // 不在2ペルソナ
  const absentPersonas = SELECTION.absentPersonaIds.map((id) => ALL_PERSONAS[id]);

  const callPersona = async (persona) => {
    const prompt = buildPersonaPrompt(persona);
    const response = await window.claude.complete(prompt);
    return response;
  };

  const callJudge = async (activeOpinions, absentSummonedNames) => {
    const prompt = buildJudgePrompt(activeOpinions, absentSummonedNames);
    const response = await window.claude.complete(prompt);
    return response;
  };

  const startCouncil = async () => {
    setGlobalError("");
    setPhase("deliberation");
    setJudgeResult("");
    setJudgeStatus("pending");
    setAbsentSummonedList([]);

    const initStates = {};
    summonedPersonas.forEach((p) => {
      initStates[p.id] = { status: "running", text: "" };
    });
    setPersonaStates(initStates);

    // 並列実行
    const personaPromises = summonedPersonas.map(async (persona) => {
      try {
        const opinion = await callPersona(persona);
        setPersonaStates((prev) => ({
          ...prev,
          [persona.id]: { status: "done", text: opinion },
        }));
        return { id: persona.id, name: persona.name, nameEn: persona.nameEn, text: opinion, absent: false };
      } catch (e) {
        setPersonaStates((prev) => ({
          ...prev,
          [persona.id]: { status: "absent", text: "" },
        }));
        return { id: persona.id, name: persona.name, nameEn: persona.nameEn, text: "", absent: true };
      }
    });

    const results = await Promise.all(personaPromises);
    const active = results.filter((r) => !r.absent);
    const absent = results.filter((r) => r.absent);

    setAbsentSummonedList(absent.map((r) => r.name));

    // フォールバック判定: 欠席2名以上で合議不能
    if (active.length < 2) {
      setPhase("fallback");
      return;
    }

    setPhase("judging");
    setJudgeStatus("running");
    try {
      const judgeText = await callJudge(active, absent.map((r) => r.name));
      setJudgeResult(judgeText);
      setJudgeStatus("done");
      setPhase("done");
    } catch (e) {
      setJudgeStatus("error");
      setGlobalError(`JUDGE層エラー: ${e.message}`);
      setPhase("error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Council 合議制</h1>
          <p className="text-slate-600 text-sm">
            3ペルソナ独立並列実行 + JUDGE統合 / window.claude.complete() / 選定情報はペルソナに非開示
          </p>
        </header>

        {/* 窓口層情報 */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-slate-200">
          <h2 className="font-bold text-slate-800 mb-3 flex items-center">
            <span className="bg-slate-700 text-white px-2 py-0.5 rounded text-xs mr-2">窓口層</span>
            悩みの再構成
          </h2>
          <p className="text-slate-700 whitespace-pre-wrap mb-4 leading-relaxed text-sm">
            {USER_QUESTION}
          </p>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-semibold text-slate-600">テーマ: </span>
              <span className="text-slate-800">{THEME}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">緊急度: </span>
              <span className="text-slate-800">{SITUATION.urgency}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">可逆性: </span>
              <span className="text-slate-800">{SITUATION.reversibility}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-600">影響範囲: </span>
              <span className="text-slate-800">{SITUATION.impactScope}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
            選定情報は窓口層で確定済み（合議終了後にJUDGE層が開示）。ペルソナには渡されない。
          </div>
        </div>

        {phase === "idle" && (
          <div className="text-center mb-6">
            <button
              onClick={startCouncil}
              className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-700 transition shadow-md"
            >
              Council 召喚（3ペルソナ並列実行）
            </button>
            <p className="text-slate-500 text-xs mt-2">
              window.claude.complete() を4回呼び出し（3ペルソナ + JUDGE）
            </p>
          </div>
        )}

        {globalError && (
          <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6">
            <p className="text-red-900 font-bold">エラー</p>
            <p className="text-red-800 text-sm">{globalError}</p>
          </div>
        )}

        {/* 合議層 */}
        {phase !== "idle" && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <span className="bg-slate-700 text-white px-2 py-0.5 rounded text-sm mr-2">合議層</span>
              召喚3ペルソナの独立意見
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {summonedPersonas.map((persona) => {
                const state = personaStates[persona.id] || { status: "pending", text: "" };
                const isAbsent = state.status === "absent";
                const isRunning = state.status === "running";

                return (
                  <div
                    key={persona.id}
                    className={`rounded-lg border-2 overflow-hidden transition ${
                      isAbsent ? "bg-slate-100 border-red-300 opacity-60" : persona.bodyClass
                    }`}
                  >
                    <div
                      className={`px-4 py-2 flex justify-between items-center ${
                        isAbsent ? "bg-red-400 text-white" : persona.headerClass
                      }`}
                    >
                      <span className="font-bold">{persona.name}</span>
                      <div className="flex items-center gap-2">
                        {isAbsent && (
                          <span className="bg-white text-red-700 text-xs px-2 py-0.5 rounded font-bold">
                            欠席
                          </span>
                        )}
                        <span className="text-xs opacity-80">{persona.nameEn}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      {isRunning && (
                        <div className="flex items-center text-slate-500">
                          <div className="animate-pulse">思考中...</div>
                        </div>
                      )}
                      {isAbsent && (
                        <p className="text-red-700 text-sm italic">
                          API障害により欠席（JUDGEが代弁します）
                        </p>
                      )}
                      {state.status === "done" && (
                        <div className={`${persona.textClass} text-sm`}>
                          {renderMarkdown(state.text)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 不在2ペルソナの可視化 */}
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                今回は不在のペルソナ（JUDGE層で代弁されます）
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {absentPersonas.map((persona) => (
                  <div
                    key={persona.id}
                    className={`rounded border ${persona.absentBgClass} px-3 py-2 text-sm`}
                  >
                    <span className="font-semibold text-slate-600">{persona.name}</span>
                    <span className="text-xs text-slate-500 ml-2">{persona.nameEn}</span>
                    <span className="text-xs text-slate-400 ml-2">不在</span>
                  </div>
                ))}
              </div>
            </div>

            {absentSummonedList.length > 0 && phase !== "fallback" && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm text-yellow-900">
                召喚ペルソナのうち欠席: {absentSummonedList.join("、")}（{absentSummonedList.length}名）
                {absentSummonedList.length < 2
                  ? " — 稼働ペルソナのみで合議継続"
                  : " — 合議不能（フォールバック発動）"}
              </div>
            )}
          </div>
        )}

        {/* フォールバック通知 */}
        {phase === "fallback" && (
          <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-5 mb-6">
            <h3 className="font-bold text-orange-900 mb-2">重量モード合議不能</h3>
            <p className="text-orange-800 text-sm mb-2">
              欠席が2名以上のため、独立合議が成立しない。
            </p>
            <p className="text-orange-800 text-sm">
              チャット側で軽量モードで再実施することを推奨する。窓口層の判定情報を引き継いで再起動できる。
            </p>
          </div>
        )}

        {/* JUDGE層 */}
        {(phase === "judging" || phase === "done") && (
          <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-5 mb-6">
            <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
              <span className="bg-amber-700 text-white px-3 py-1 rounded mr-3 text-sm">JUDGE</span>
              統合判定
            </h2>
            {judgeStatus === "running" && (
              <div className="text-amber-700 animate-pulse">
                {summonedPersonas.length - absentSummonedList.length}名の意見を統合中...
              </div>
            )}
            {judgeStatus === "done" && (
              <div className="text-amber-950">{renderMarkdown(judgeResult)}</div>
            )}
          </div>
        )}

        {/* 献上の念押し */}
        {phase === "done" && (
          <div className="bg-slate-900 text-slate-100 rounded-lg p-5 text-center shadow-lg">
            <p className="text-sm opacity-80 mb-1">これは参考意見である</p>
            <p className="font-bold text-lg">最終決定はあなた自身が行う</p>
          </div>
        )}

        <footer className="mt-8 text-center text-xs text-slate-500">
          Council SK v3.1 / Heavy Mode / window.claude.complete() 並列実行 / 選定情報非開示原則
        </footer>
      </div>
    </div>
  );
}
