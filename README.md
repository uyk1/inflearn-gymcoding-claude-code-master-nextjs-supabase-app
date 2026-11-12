<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#소셜-로그인-설정-github--google"><strong>소셜 로그인 설정</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Proxy
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

```env
NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=[INSERT SUPABASE PROJECT API PUBLISHABLE OR ANON KEY]
```

> [!NOTE]
> This example uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, which refers to Supabase's new **publishable** key format.
> Both legacy **anon** keys and new **publishable** keys can be used with this variable name during the transition period. Supabase's dashboard may show `NEXT_PUBLIC_SUPABASE_ANON_KEY`; its value can be used in this example.
> See the [full announcement](https://github.com/orgs/supabase/discussions/29260) for more information.

Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` can be found in [your Supabase project's API settings](https://supabase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## 소셜 로그인 설정 (GitHub / Google)

이메일/비밀번호 로그인 외에 GitHub, Google 소셜 로그인을 지원합니다. 코드는 이미 구현되어 있고, **각 공급자의 OAuth 앱 생성과 Supabase 설정만 하면** 동작합니다.

### 동작 방식

```
앱(/auth/login) → 공급자(GitHub/Google) 로그인 → Supabase(/auth/v1/callback)
              → 앱(/auth/callback)에서 코드를 세션으로 교환 → 원래 가려던 페이지(next)
```

- 버튼: `components/social-sign-in-buttons.tsx` (로그인, 회원가입 화면에 표시)
- 콜백: `app/auth/callback/route.ts` (인증 코드를 세션으로 교환, 실패 시 `/auth/error`)
- 복귀 경로: 로그인하지 않고 보호 페이지에 접근하면 `/auth/login?next=<원래 경로>`로 이동하고, 로그인 후 그 경로로 돌아옵니다. 외부 주소는 `lib/auth/safe-redirect.ts`가 차단합니다.
- 같은 이메일로 가입한 기존 계정은 소셜 로그인 시 Supabase가 자동으로 하나의 계정에 연결합니다. (Supabase의 **Confirm email** 설정이 켜져 있어야 안전합니다.)

### 공통: Supabase 콜백 주소 확인

공급자 설정에 넣을 **콜백 주소**는 앱 주소가 아니라 **Supabase 주소**입니다.

```
https://<프로젝트-ref>.supabase.co/auth/v1/callback
```

Supabase 대시보드의 **Authentication → Sign In / Providers → (공급자)** 화면에 **Callback URL**로 표시되므로 그대로 복사해서 사용하면 오타를 피할 수 있습니다.

> 공급자마다 이 입력칸을 **Authorization callback URL**, **승인된 리디렉션 URI(Authorized redirect URIs)**, **Redirect URIs** 등 다른 이름으로 부릅니다. 이름이 달라도 같은 값을 넣습니다. 화면 구성은 서비스 사정에 따라 바뀔 수 있습니다.

### 1. GitHub 로그인 (무료, 결제 정보 불필요)

1. GitHub에서 **Settings → Developer settings → OAuth Apps → New OAuth App**을 엽니다. (https://github.com/settings/developers)
2. 다음과 같이 입력하고 등록합니다.
   - **Application name**: 원하는 이름
   - **Homepage URL**: `http://localhost:3000`
   - **콜백 주소**: 위의 Supabase 콜백 주소
3. **Client ID**를 복사하고, **Client Secret**을 새로 만들어 복사합니다. (Secret은 만든 직후에만 보이는 경우가 많습니다.)
4. Supabase 대시보드 **Authentication → Sign In / Providers → GitHub**에서 활성화하고 Client ID와 Client Secret을 입력한 뒤 저장합니다.
   - **Allow users without an email**은 끈 상태로 둡니다. (`public.profiles`가 이메일을 사용합니다.)

### 2. Google 로그인 (Google Cloud 계정 필요, 결제 정보 등록을 요구할 수 있음)

1. [Google Cloud Console](https://console.cloud.google.com)에서 프로젝트를 만들고 **Google Auth Platform**을 엽니다.
2. **브랜딩**에서 앱 이름과 지원 이메일을 입력합니다.
3. **대상(Audience)**은 **외부(External)**, 게시 상태는 **테스트(Testing)**로 두고 로그인에 쓸 Gmail을 **테스트 사용자**에 추가합니다. (테스트 상태에서는 등록한 계정만 로그인할 수 있습니다.)
4. **데이터 액세스(범위)**는 `openid`, `userinfo.email`, `userinfo.profile` 3개만 사용합니다.
5. **클라이언트 → 클라이언트 만들기**에서 **웹 애플리케이션**을 선택하고 다음을 입력합니다.
   - **승인된 JavaScript 원본**: `http://localhost:3000`
   - **승인된 리디렉션 URI**: 위의 Supabase 콜백 주소
6. 생성된 **클라이언트 ID**와 **보안 비밀번호**를 복사합니다.
7. Supabase 대시보드 **Authentication → Sign In / Providers → Google**에서 활성화하고 값을 입력한 뒤 저장합니다. (**Skip nonce check**, **Allow users without an email**은 끈 상태로 둡니다.)
8. 코드에서 Google 버튼을 켭니다. `components/social-sign-in-buttons.tsx`의 `providers` 목록에서 Google 항목을 `enabled: true`로 바꿉니다. (현재는 설정 전이라 숨겨져 있습니다.)

### 3. Supabase URL 설정 (공통)

**Authentication → URL Configuration**에서 설정합니다.

| 항목          | 로컬 개발 값               | 설명                              |
| ------------- | -------------------------- | --------------------------------- |
| Site URL      | `http://localhost:3000`    | 기본 이동 주소                    |
| Redirect URLs | `http://localhost:3000/**` | 로그인 후 돌아올 주소의 허용 목록 |

배포하면 배포 도메인도 함께 등록합니다. (공급자 설정의 홈페이지/JavaScript 원본, Supabase의 Site URL과 Redirect URLs 모두. 운영 환경에서는 `**` 대신 `https://<도메인>/auth/callback`처럼 정확한 경로를 권장합니다.)

### 4. 테스트

1. `npm run dev`로 실행하고 반드시 `http://localhost:3000`(`127.0.0.1`이 아님)으로 접속합니다. (PKCE 확인용 쿠키가 호스트에 묶입니다.)
2. `/auth/login`에서 소셜 로그인 버튼을 눌러 승인하면 `/protected`로 이동해야 합니다.
3. 로그아웃 후 `/protected`를 주소창에 직접 입력하면 로그인 화면으로 이동하고, 로그인 후 `/protected`로 돌아오는지 확인합니다.

### 문제 해결

| 증상                                          | 원인과 해결                                                                                                     |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `provider is not enabled`                     | Supabase에서 해당 공급자가 꺼져 있거나 저장되지 않았습니다.                                                     |
| `redirect_uri_mismatch` 등 주소 불일치        | 공급자에 넣은 콜백 주소가 Supabase의 Callback URL과 다릅니다. 오타와 마지막 슬래시를 확인하세요.                |
| Google에서 `access_denied`                    | 로그인한 계정이 **테스트 사용자**에 없습니다.                                                                   |
| 로그인 후 `/?code=...`로 이동하고 세션이 없음 | Redirect URLs 허용 목록에 `http://localhost:3000/**`가 없습니다.                                                |
| 로그인은 되는데 이름이 비어 있음              | 공급자 계정에 표시 이름이 없으면 `public.profiles.full_name`이 비어 있습니다. (예: GitHub 프로필의 Name 미설정) |

### 보안 주의

- **Client Secret**은 코드, 커밋, 채팅에 남기지 말고 Supabase 대시보드에만 입력합니다. 이 앱의 환경 변수(`.env.local`)에는 넣지 않습니다.
- 브라우저에는 publishable(anon) 키만 사용합니다. `service_role` 키와 DB 비밀번호는 절대 노출하지 않습니다.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
