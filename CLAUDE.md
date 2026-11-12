# CLAUDE.md

이 문서는 Claude Code가 이 프로젝트에서 작업할 때 따라야 할 지침입니다.

## 프로젝트 개요

Next.js + Supabase 인증/데이터 학습 프로젝트입니다. (인프런 클로드 코드 완벽 마스터 과정)

## 기술 스택 (실제 설치 기준)

- Next.js 16 (App Router), React 19, TypeScript 5 (strict)
- **Tailwind CSS v3.4** (`tailwind.config.ts` 사용, v4 아님) + `tailwindcss-animate`
- shadcn/ui (new-york 스타일, `components.json` 기준) + Radix UI + lucide-react
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`), 인증은 쿠키 기반 세션
- 패키지 매니저: **npm** (`package-lock.json`)

## 폴더 구조

`src/` 폴더 없이 프로젝트 루트 기준입니다. 경로 별칭 `@/*`는 루트(`./*`)를 가리킵니다.

```
app/                 # App Router 페이지 (auth/, protected/, instruments/ ...)
components/          # 공용 컴포넌트 (ui/ 는 shadcn 생성 컴포넌트)
lib/supabase/        # client.ts / server.ts / proxy.ts (Supabase 클라이언트)
lib/utils.ts         # cn() 등 유틸리티
types/database.ts    # Supabase 자동 생성 타입 (직접 수정 금지)
proxy.ts             # 세션 갱신 및 인증 리다이렉트 (Next 16 proxy)
docs/guides/         # 참고 가이드
```

## 명령어

```bash
npm run dev           # 개발 서버
npm run check         # 타입 체크 + ESLint + Prettier 검사 (작업 완료 전 필수)
npm run typecheck     # tsc --noEmit
npm run lint          # ESLint 검사 (lint:fix 로 자동 수정)
npm run format        # Prettier 자동 포맷 (format:check 로 검사만)
npm run build         # 프로덕션 빌드
```

**작업을 끝내기 전에 반드시 `npm run check`를 실행**하고 오류가 없는지 확인하세요.

## 코딩 규칙

- 들여쓰기 2칸, 쌍따옴표, 세미콜론 사용 (Prettier가 자동 적용)
- 변수명/함수명은 영어 camelCase, 컴포넌트는 PascalCase
- 코드 주석, 커밋 메시지, 문서는 **한국어**로 작성
- Tailwind 클래스 정렬은 `prettier-plugin-tailwindcss`가 자동 처리하며, 조건부 클래스는 `cn()`(`@/lib/utils`)을 사용
- 타입은 `import { type Foo }` 형태의 인라인 type import 사용
- `any` 사용 금지, `console.log`는 남기지 않음 (`warn`/`error`만 허용)
- 에러 핸들링을 반드시 포함하고, API 응답 형식은 일관되게 유지

## Supabase 규칙

- 서버 클라이언트(`lib/supabase/server.ts`의 `createClient`)는 **전역 변수에 담지 말고 함수 안에서 매번 생성**합니다.
- `types/database.ts`는 직접 편집하지 않고 Supabase MCP의 `generate_typescript_types`로 재생성합니다.
- 환경 변수는 `.env.local`에만 보관합니다. 사용 중인 변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `service_role` 키, DB 비밀번호 등 비밀 값은 코드, 문서, 커밋에 절대 넣지 않습니다.
- 스키마 변경 전에는 기존 테이블 구조를 먼저 확인하고, 변경은 마이그레이션으로 적용합니다.

## 자동 안전장치 (수정하거나 우회하지 말 것)

- **Husky pre-commit**: 스테이징된 파일에 `eslint --fix`, `prettier --write` 실행 (lint-staged)
- **Husky pre-push**: `npm run typecheck && npm run lint`
- **Claude 훅** (`.claude/settings.json`)
  - 실행 전: `.env*`, `package-lock.json`, `node_modules`, `.next` 수정, `rm -rf`, `git push --force`, `git reset --hard`, `--no-verify`, `.env` 내용 출력 명령을 차단
  - 편집 후: 수정한 파일을 Prettier로 포맷하고 ESLint로 검사 (오류가 있으면 바로 수정)
- 훅이나 Husky 검사에서 막히면 우회하지 말고 원인을 해결하세요.

## 참고 문서

`docs/guides/`의 가이드는 다른 스타터 프로젝트 기준으로 작성되어 **실제 프로젝트와 다른 부분**이 있습니다.
(예: Tailwind v4, `src/` 폴더 구조, Next.js 15 기준 설명) 충돌하면 이 문서와 실제 코드를 우선합니다.
