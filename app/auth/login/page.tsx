import { LoginForm } from "@/components/login-form";
import { getSafeNextPath } from "@/lib/auth/safe-redirect";
import { Suspense } from "react";

// searchParams는 요청 시점 데이터이므로 Suspense 안에서 읽는다 (cacheComponents)
async function LoginFormWithNext({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  // 배열로 들어오면 첫 값만 사용하고, 외부 주소는 기본 경로로 대체
  const rawNext = Array.isArray(next) ? next[0] : next;

  return <LoginForm next={getSafeNextPath(rawNext)} />;
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense>
          <LoginFormWithNext searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
