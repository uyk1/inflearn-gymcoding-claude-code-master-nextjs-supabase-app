"use client";

import { GoogleIcon } from "@/components/google-icon";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

// 구글 로그인 버튼: PKCE 흐름을 시작하고 구글 인증 화면으로 이동
export function GoogleSignInButton({ next = "/protected" }: { next?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // 인증 후 /auth/callback에서 코드를 세션으로 교환하고 next로 이동
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      // 성공하면 브라우저가 구글로 이동하므로 로딩 상태를 유지
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <GoogleIcon />
        {isLoading ? "Redirecting..." : "Continue with Google"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
