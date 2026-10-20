# 포트폴리오에 새 작업 추가하기

`index.html`을 더블클릭하면 바로 열립니다. (서버 불필요)

## 폴더 구조

```
포트폴리오/
├─ index.html              # 페이지 뼈대 (수정 거의 없음)
├─ css/style.css           # 디자인
├─ js/data.js              # ★ 내용은 여기만 수정 (프로필 / 스킬 / 프로젝트)
├─ js/main.js              # 렌더링 로직
├─ assets/projects/<id>/   # 프로젝트별 이미지·첨부 파일 (원본에서 복사해 온 것)
└─ 프로젝트/<번호>/         # 원본 작업 폴더 (Notion 내보내기 md + 이미지 + 스크립트)
```

## 새 프로젝트 추가 순서

1. 원본을 `프로젝트/<번호>/` 에 넣는다 (예: `프로젝트/2/`)
2. 필요한 이미지·파일을 `assets/projects/<프로젝트-id>/` 에 복사 (파일명은 영문·소문자·하이픈 권장)
3. `js/data.js` 의 `PROJECTS` 배열 **맨 앞**에 객체 추가 (최신 작업이 먼저 표시됨)
4. 브라우저 새로고침

### 최소 예시

```js
{
  id: "my-new-lab",                         // 폴더명·URL(#project/my-new-lab)에 사용
  title: "프로젝트 이름",
  subtitle: "한 줄 설명",
  period: "2026.10",
  tags: ["Web", "Pentest"],                 // 상단 필터 버튼이 자동 생성됨
  status: "완료",                            // 생략 가능
  cover: "assets/projects/my-new-lab/cover.png",
  summary: "카드/상세 상단에 들어갈 2~3문장 요약",
  stats: [{ label: "Vuln", value: "7" }],   // 생략 가능
  meta:  [{ k: "환경", v: "Kali · DVWA" }],  // 생략 가능
  blocks: [ /* 아래 블록 종류 참고 */ ]
}
```

## blocks 종류

| type | 필드 | 용도 |
| --- | --- | --- |
| `text` | `title`, `body`, `nav`(선택) | 설명 문단. `nav` 를 적으면 대단원 제목 + 상단 목차 버튼이 생김. `` `코드` `` 인라인 표기 가능 |
| `image` | `src`, `caption` | 큰 이미지 1장 (클릭 시 확대) |
| `gallery` | `columns`(2/3), `images:[{src,caption}]` | 이미지 여러 장 |
| `highlights` | `title`, `items:[{h,p}]` | 핵심 작업 카드 |
| `steps` | `items:[{h,p}]` | 번호가 붙는 작업 순서 |
| `table` | `head:[]`, `rows:[[]]` | 표 |
| `code` | `title`, `code` | 명령어·설정 (`#` 주석 줄은 흐리게, `Action: allow/drop` 자동 강조) |
| `file` | `title`, `desc`, `href` | 첨부 파일 다운로드 (스크립트 등) |
| `callout` | `title`, `body` | 강조 박스 (트러블슈팅, 진행 상황 등) |

## 기존 프로젝트에 내용 이어 붙이기

진행 중인 프로젝트(System Security Lab의 CTF 등)는 해당 객체의 `blocks` 에 블록을 추가하면 됩니다.

## 걸어온 길(이력) 수정하기

`js/data.js` 의 `PATH` 배열을 고칩니다. 시험에 합격하거나 과정을 수료하면 `status` 만 바꾸면 됩니다.

```js
{ label: "리눅스마스터 2급 · 1차", desc: "한 줄 설명", status: "준비 중" }  // → status: "합격"
```

## 개인정보 채우기

`js/data.js` 상단 `PROFILE` 의 `name`, `role`, `email`, `github`, `blog` 를 수정하세요.
비워둔 항목(github, blog)은 Contact 영역에 표시되지 않습니다.

## 제출 전 체크리스트

- [ ] 이름·이메일 입력
- [ ] 캡처·코드에 개인정보(계정명, 실제 비밀번호 등)가 없는지 확인
- [ ] 모든 이미지가 정상 표시되는지 확인 (깨진 이미지 없음)
- [ ] 결과 캡처가 없는 항목은 "설정" 수준으로만 서술했는지 확인

## 이야기 · 세 능력 · 숫자 · 대표작 (12번 과제에서 추가)

- 이야기·세 능력 장면·대표작 문장은 `index.html` 의 `#story` `#abilities` `#works` 에 직접 적혀 있다.
- 숫자 칸과 「세 능력」 아래 승인 문단은 `js/generated.js` 에서 온다. **직접 고치지 않는다.**
  새 리추얼 기록을 `ai과제 12/결과물/장치/inputs/` 에 넣고 `py refresh.py` 를 돌리면 이 파일이 다시 만들어진다.
  (장치의 `inputs/config.json` → `"site": "../../../포트폴리오"` 가 이 폴더를 가리킨다.)
- 한 줄 소개는 `js/data.js` 의 `PROFILE.tagline`.
- 논문은 `paper/`, 이력서·자기소개서·경력기술서 문서는 `assets/docs/`.
- 13번 앱이 나오면 `#works` 의 "13번 앱이 들어갈 자리" 카드를 바꾼다.
