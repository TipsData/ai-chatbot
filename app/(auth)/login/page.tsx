"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [signInError, setSignInError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setSignInError(null);
      const result = await signIn("cognito", {
        callbackUrl: "/",
        redirect: true,
      });
      console.log("Sign-in result:", result);
    } catch (error) {
      console.error("Sign-in error:", error);
      setSignInError("Failed to initiate sign-in. Please try again.");
    }
  };

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch("/api/auth/session");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Session data:", data);
      } catch (error) {
        console.error("Session fetch error:", error);
      }
    }
    checkSession();
  }, []);

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Sign in with your Cognito account
          </p>
          {error && (
            <p className="text-sm text-red-500">Error: {error}</p>
          )}
          {signInError && (
            <p className="text-sm text-red-500">{signInError}</p>
          )}
        </div>
        <div className="flex flex-col items-center gap-4 px-4 sm:px-16">
          <button
            onClick={handleSignIn}
            style={{
              padding: "1rem 2rem",
              fontSize: "1.2rem",
              borderRadius: "8px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign in with Cognito
          </button>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {"Don't have an account? "}
            <Link
              href="/register"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign up
            </Link>
            {" for free."}
          </p>
        </div>
      </div>
    </div>
  );
}