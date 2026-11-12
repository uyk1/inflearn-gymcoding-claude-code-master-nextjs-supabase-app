// 이메일 로그인과 소셜 로그인 사이의 구분선
export function AuthDivider() {
  return (
    <div className="my-4 flex items-center gap-3 text-sm text-muted-foreground">
      <div className="h-px flex-1 bg-border" />
      <span>Or</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
