'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Determine where to send them (usually dashboard or login)
    // The AuthGuard in layout.tsx will handle the login redirection if needed
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-400">
      Redirecting...
    </div>
  );
}
