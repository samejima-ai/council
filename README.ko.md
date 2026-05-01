<p align="center">
  <a href="README.md">日本語</a> ·
  <a href="README.en.md">English</a> ·
  <strong>한국어</strong> ·
  <a href="README.es.md">Español</a> ·
  <a href="README.fr.md">Français</a>
</p>

<h1 align="center">Council — 협의제 의사결정 지원 스킬</h1>

<p align="center">
  <em>3페르소나 협의제로 개인 의사결정을 다각도로 지원하는 Claude 스킬</em>
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

> 사용자의 일회성 고민·갈등·선택의 기로에 대해, 주제와 상황에 따라 동적으로 선정된 3페르소나의 협의로 다각적 의견을 제시하는 의사결정 지원 스킬.

**Version**: 3.1 / **Target**: Claude.ai (chat) · Claude Code · 기타 Claude 스킬 대응 환경 / **API**: `window.claude.complete()` / **License**: MIT

> [!NOTE]
> "Open in Claude.ai"는 Claude.ai 홈으로의 단축 링크입니다. 원클릭 설치 기능은 아직 없으므로, 첫 실행 시에는 아래 [퀵스타트](#퀵스타트)에 따라 Project에 SKILL.md를 등록해 주세요.

> [!IMPORTANT]
> 스킬 본체는 일본어로 작성되어 있습니다 (SKILL.md, 페르소나 지시문, 트리거 문구). 하지만 **Claude의 의미 매칭 덕분에 스킬은 다국어에서 발화합니다** — 한국어로 "협의해서 X를 결정해 줘"라고 요청해도 작동합니다. 출력 언어는 입력 언어를 따라갑니다. 원래의 일본어 트리거(「councilで」「合議して」 등)도 그대로 사용 가능합니다.

---

## 이 스킬은 무엇인가

Claude에 고민을 상담하면 보통 하나의 응답이 돌아옵니다. 편리하지만 **다각성이 사라진다**는 구조적 한계가 있습니다.

Council은 주제와 상황에 따라 선정된 **3가지 독립적인 사고 양식 (5페르소나 풀에서 동적 선정)**으로 협의를 성립시키고, 마지막에 JUDGE 층이 통합합니다. 호출되지 않은 2명의 페르소나의 시점은 JUDGE가 마이너리티 리포트로 대변합니다.

**목적**: 결론을 강요하는 것이 아닙니다. **사용자가 스스로 납득할 수 있는 답을 찾기 위한 재료를 제시하는 것**입니다.

---

## 주요 특징

- **5페르소나 후보 풀**: 현자 / 전략가 / 직관가 / 반역자 / 평범인
- **동적 3페르소나 선정**: 주제와 상황 파라미터에 따라 트리아지 층이 선정
- **3층 아키텍처**: 트리아지 층 / 협의 층 / JUDGE 층
- **두 가지 모드**:
  - 경량 모드: 단일 Claude 내 롤 연기로 채팅 내 즉시 출력
  - 중량 모드: `window.claude.complete()`를 통한 **물리적으로 독립**된 3병렬 실행
- **부재 페르소나의 대변**: 호출되지 않은 2명의 시점을 JUDGE가 대변, 5페르소나 상당의 다각성을 의사적으로 확보
- **R/R/A 평가축**: Regret(후회) / Reversibility(철회 가능성) / Alignment(가치관 정합성)
- **결석 전략 + 폴백**: API 장애 시의 견고한 축퇴 운전
- **비용 효율**: 협의 1회당 4회의 API 호출 (Claude.ai Pro 5시간 한도의 약 9%)
- **중립성 견지**: 결론을 사용자에게 강요하지 않는 설계

---

## 발화 방법

사용자가 다음 중 하나를 발언했을 때에만 발화합니다. 일본어 트리거와 한국어 표현 모두 작동합니다:

| 일본어 트리거 (원본) | 한국어 (이것도 발화) |
|---|---|
| 「councilで」「council起動」「council召喚」 | "council로", "council 호출해 줘" |
| 「合議して」「合議制で」 | "협의해 줘", "협의제로" |
| 「多角的に意見が欲しい」「いろんな視点で」 | "다각적 의견이 필요해", "여러 관점에서" |
| 「Councilメンバーに聞いて」 | "Council 멤버에게 물어봐" |

일반적인 고민 상담·푸념·잡담에서는 발화하지 않습니다 (오발 방지).

---

## 파일 구성

```
council/
├── README.md                          日本語 (주언어)
├── README.en.md                       English
├── README.ko.md                       한국어 (이 파일)
├── README.es.md                       Español
├── README.fr.md                       Français
├── SKILL.md                           스킬 본체 (필수 로드 대상)
├── LICENSE                            MIT 라이선스
├── CHANGELOG.md                       개정 이력
├── references/
│   ├── light-mode-format.md           경량 모드 출력 포맷 사양
│   ├── heavy-mode-artifact.md         중량 모드 Artifact 구현 가이드
│   ├── examples.md                    입출력 예제
│   ├── installation.md                환경별 도입 절차
│   ├── customization.md               커스터마이즈 가이드
│   └── troubleshooting.md             FAQ·장애 대응
└── examples/
    └── council-heavy-mode.jsx         중량 모드 참고 구현 (React)
```

---

## 퀵스타트

### Claude.ai를 사용 중인 경우

1. [Claude.ai](https://claude.ai)에 로그인
2. 새 Project를 생성
3. Project Knowledge에 이 저장소의 파일을 업로드 (최소 `SKILL.md` + `references/`)
4. Project의 Custom Instructions에 Council SK가 사용 가능함을 명시
5. 해당 Project 안에서 "council로 X에 대해 상담하고 싶어"와 같이 말걸기

### Claude Code를 사용 중인 경우

```bash
# 1. 스킬 디렉터리에 클론
git clone https://github.com/samejima-ai/council-jp.git ~/.claude/skills/council-jp

# 2. Claude Code를 시작하고 council을 호출 (자동 인식됨)
```

프로젝트 로컬 설치의 경우 `<project>/.claude/skills/council-jp/` 아래에 배치합니다.

자세한 내용은 [`references/installation.md`](references/installation.md)를 참조하세요.

---

## 적용 사용 사례

| 적합 | ✅ |
|-----|---|
| 커리어 선택 (이직·진학·독립·철수) | ✅ |
| 인간관계 (연애·친구·직장) | ✅ |
| 창조적 도전 (예술·창업·신규 사업) | ✅ |
| 금전 판단 (투자·고액 구매·주거) | ✅ |
| 윤리적 갈등 (가족 책임·도덕적 선택) | ✅ |
| 정체 타파 (매너리즘·현상 탈출) | ✅ |

| 부적합 | ❌ |
|-------|---|
| 개발·구현의 기술 판단 | ❌ 다른 스킬 권장 |
| 타인의 대리 의사결정 | ❌ 당사자성이 필요 |
| 긴급성이 매우 높은 판단 (생명에 관한 등) | ❌ 전문 기관 권장 |
| 사실 확인·정보 검색 | ❌ 웹 검색 등을 사용해야 함 |

### 사용 예 (구체적 프롬프트)

사용자가 Claude에게 실제로 던지는 예:

```
council로 30대의 이직에 대해 상담하고 싶어.
지금 회사는 안정적이지만 성장이 느껴지지 않아.
다만 가족이 있어서 리스크는 너무 키우고 싶지 않아.
```

```
협의해 줘. 동거 중인 연인과 가치관의 어긋남이 느껴져.
헤어져야 할지, 좀 더 이어가야 할지 모르겠어.
```

```
다각적 의견이 필요해. 투자로 얻은 300만을 창업 자금으로 쓸지,
주택 대출 조기 상환에 쓸지 망설이고 있어.
```

```
council로 생각해 줘. 부모 간병으로 본가 근처로 이사하라는 압박이 있는데,
일의 커리어와 양립할 수 있을지 불안해.
```

트리거는 일본어 「councilで」「合議して」 외에, 한국어 "council로", "협의해 줘" 등으로도 발화합니다 (Claude의 의미 매칭).

---

## 유사 스킬과의 차이

"협의제 / Multi-Persona Council"은 Claude 스킬 중에서도 참여가 늘고 있는 영역입니다. Council SK (`council-jp`)를 선택할 이유를 솔직하게 정리합니다.

### 이 영역에서 일반적인 경향

- 7~18명의 고정 페르소나를 매번 풀 호출
- 주 용도는 기술 판단 (코드 리뷰 / 아키텍처 / 전략 결정)
- "Verdict"(평결)을 제시
- Claude Code의 서브 에이전트 기능으로 병렬 실행
- 영어 우선

### Council SK의 포지션

| 축 | 일반적인 접근 | Council SK (`council-jp`) |
|---|---|---|
| 페르소나 선정 | N명 고정 호출 | **5풀에서 3명 동적 선정** (주제·상황 의존) |
| 주 용도 | 기술 판단 중심 | **개인의 인생 판단** (커리어·인간관계·금전·윤리) |
| 결론 자세 | 평결 제시 | **중립 견지** (강요하지 않음) |
| 독립성 보전 | 통상 고려되지 않음 | **맹선정** (다른 누가 선정되었는지 본인에게 비공개) |
| 실행 모드 | 단일 모드 | **경량 + 중량의 두 모드** (중량은 Claude.ai Artifact에서 물리적 독립 병렬) |
| 평가축 | 자유 형식 | **R/R/A** (Regret / Reversibility / Alignment) |
| 부재 페르소나 | 버려짐 | **JUDGE가 대변** (마이너리티 리포트) |
| 주언어 | 영어 | **일본어 우선** (다국어 README로 도입선) |

### 관련 프로젝트 (참고)

- [itshussainsprojects/Claude-Council-Skill](https://github.com/itshussainsprojects/Claude-Council-Skill) — 7명 고정, 개인 의사결정 지향 (사상이 가장 가까움)
- [0xNyk/council-of-high-intelligence](https://github.com/0xNyk/council-of-high-intelligence) — 18명 고정, 아리스토텔레스 / 파인만 / 카너먼 등, 멀티 LLM 프로바이더
- [tsenart/council-skill](https://github.com/tsenart/council-skill) — Codex / Claude Code / Amp 횡단 포터블 council
- [wan-huiyan/agent-review-panel](https://github.com/wan-huiyan/agent-review-panel) — 코드/플랜 리뷰 특화의 adversarial panel

이 영역은 활발하고 경쟁은 앞으로도 늘어날 전망입니다. Council SK (`council-jp`)가 차별화를 주장할 수 있는 것은 **"개인 인생 판단 × 중립 견지 × 두 모드 × 일본어 우선"** 의 조합입니다.

---

## 사상적 배경

### 설계 철학 — 왜 "편향된 소수"인가

협의는 **특성을 좁힌 최소 인원**으로 해야 한다.

필요한 것은 **편향된 의견에 의한 협의**이지, 다수결이 아니다.

인간의 협의는 다수가 중지를 모아 다수결로 지혜를 결정화하는 구조이다. 그러나 AI에 이 구조를 그대로 적용해도 최선의 답은 끌어낼 수 없다.

**AI에서 최선을 끌어내는 것은, 응축된 편향된 시점을 정면으로 부딪치게 하고, 지양 (止揚 / Aufhebung)시키는 과정이다** ── 이것이 Council SK의 핵심 가설이다.

그래서 Council SK는 "다수의 페르소나를 늘어놓고 합의를 얻는" 설계를 취하지 않는다. "**소수의 날카로운 시점을 의도적으로 대립시키고, JUDGE에게 지양시키는**" 설계를 취한다.

5풀에서 3명 (주축 2 + 보조 1) / 맹선정 / R/R/A 평가 ── 이 모든 것은 이 하나의 가설에서 도출되었다.

### 왜 "협의제"인가

인간의 의사결정은 **단일 시점에서는 반드시 사각지대가 남습니다**.
역사적으로 중요한 판단은 의회·이사회·합의제 재판부 등 복수 시점에 의한 검증 구조를 가져왔습니다.
LLM이 개인의 의사결정 지원에 들어올 때 이 구조를 계승해야 한다는 생각에 기반합니다.

다만 AI에서의 협의는 인간의 그것과 구조적으로 다릅니다 ── 위의 "설계 철학"을 참조.

### 왜 "선정 이유는 페르소나에게 비공개"인가

페르소나가 "자신이 선정된 이유·다른 누가 선정되었는지"를 알면 의견이 무의식적으로 강화/약화되어 독립성이 붕괴됩니다.
선정 정보는 협의 전에 확정되지만 협의가 끝날 때까지 페르소나에게 알려주지 않습니다.

### 왜 "결론을 강요하지 않는가"

이 스킬은 **의사결정 지원 장치**이며 **의사결정자**가 아닙니다.
JUDGE 층의 통합 결론은 어디까지나 참고이며, 최종 결정은 사용자 자신이 합니다.

---

## 알려진 제약

- **Claude.ai 의존**: `window.claude.complete()`는 Claude.ai Artifact 환경 전용
- **모델 지정 불가**: Claude.ai 측이 선정한 모델로 실행됨
- **API 병렬 상한 불명**: 3병렬은 테스트 확인 완료, 상한은 Claude.ai 구현에 의존
- **3페르소나 병렬의 API 비용**: 협의 1회에 4회 API 호출 (Pro 5시간 한도 약 45 중 4 소비)
- **채팅 이력의 휘발성**: 과거 협의 결과는 자동 저장되지 않음 (필요하면 중량 모드로 Artifact화)

---

## 버그 보고·기여

이 스킬은 개인 의사결정 지원을 목적으로 한 사상 실험입니다. 버그 보고와 개선 제안은 GitHub Issues를 통해 환영합니다.

---

## 라이선스

MIT License — [`LICENSE`](LICENSE) 파일을 참조하세요.

---

## 관련 문서

| 문서 | 용도 |
|------------|------|
| [SKILL.md](SKILL.md) | 스킬 본체·구현의 핵심 |
| [references/installation.md](references/installation.md) | 환경별 도입 절차 |
| [references/examples.md](references/examples.md) | 입출력 예제 |
| [references/customization.md](references/customization.md) | 커스터마이즈 방법 |
| [references/troubleshooting.md](references/troubleshooting.md) | FAQ·장애 대응 |
| [CHANGELOG.md](CHANGELOG.md) | 개정 이력 |
