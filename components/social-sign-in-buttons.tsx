"use client";

import { GoogleIcon } from "@/components/google-icon";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Github } from "lucide-react";
import { useState } from "react";

type OAuthProvider = "google" | "github";

// 지원하는 소셜 로그인 목록 (표시 순서대로)
// enabled가 false인 공급자는 화면에 표시하지 않는다.
// Google은 Google Cloud 설정을 마치면 enabled를 true로 바꾼다.
const providers: {
  id: OAuthProvider;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
}[] = [
  {
    id: "google",
    label: "Continue with Google",
    Icon: GoogleIcon,
    enabled: false,
  },
  {
    id: "github",
    label: "Continue with GitHub",
    Icon: Github,
    enabled: true,
  },
];

const enabledProviders = providers.filter((provider) => provider.enabled);

// 소셜 로그인 버튼 모음: PKCE 흐름을 시작하고 공급자 인증 화면으로 이동
export function SocialSignInButtons({
  next = "/protected",
}: {
  next?: string;
}) {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (provider: OAuthProvider) => {
    const supabase = createClient();
    setLoadingProvider(provider);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // 인증 후 /auth/callback에서 코드를 세션으로 교환하고 next로 이동
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      // 성공하면 브라우저가 공급자 화면으로 이동하므로 로딩 상태를 유지
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {enabledProviders.map(({ id, label, Icon }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleSignIn(id)}
          disabled={loadingProvider !== null}
        >
          <Icon />
          {loadingProvider === id ? "Redirecting..." : label}
        </Button>
      ))}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
