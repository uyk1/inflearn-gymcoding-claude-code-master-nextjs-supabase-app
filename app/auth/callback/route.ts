import { getSafeNextPath } from "@/lib/auth/safe-redirect";
import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

// 오류 메시지를 인코딩해 /auth/error 페이지로 이동
function redirectToError(origin: string, message: string) {
  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent(message)}`,
  );
}

// 구글 OAuth(PKCE) 콜백: 인증 코드를 세션으로 교환한 뒤 원래 경로로 이동
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));

  // 동의 화면 취소 등 공급자가 오류를 돌려준 경우
  const providerError =
    searchParams.get("error_description") ?? searchParams.get("error");
  if (providerError) {
    return redirectToError(origin, providerError);
  }

  if (!code) {
    return redirectToError(origin, "No authorization code");
  }

  // 전역 변수에 담지 않고 요청마다 새로 생성
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return redirectToError(origin, error.message);
  }

  const response = NextResponse.redirect(`${origin}${next}`);
  // 세션 쿠키가 포함된 응답이 캐시되지 않도록 설정
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
