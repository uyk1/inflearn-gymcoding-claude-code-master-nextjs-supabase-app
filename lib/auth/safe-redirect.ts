// URL 파싱 시 기준이 되는 가상 origin (실제 요청 주소와 무관)
const BASE_ORIGIN = "http://localhost";

/**
 * 로그인 후 이동 경로(next)를 같은 사이트 내부 경로로만 제한합니다.
 * 외부 주소(//evil.com, /\evil.com, https://evil.com 등)는 fallback으로 대체해
 * open redirect 공격을 막습니다.
 */
export function getSafeNextPath(
  next: string | null | undefined,
  fallback = "/protected",
): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(next, BASE_ORIGIN);
    // 브라우저가 /\evil.com 을 //evil.com 으로 해석하는 우회를 origin 비교로 차단
    if (url.origin !== BASE_ORIGIN) {
      return fallback;
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
