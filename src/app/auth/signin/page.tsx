"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookIcon } from "@/components/ui/Icons";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/upload");
    }
  };

  return (
    <main className="min-h-screen text-ink-dark flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="book-card rounded-xl p-8">
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-6 text-center">
              Sign In
            </h1>
            {error && <p className="text-bookmarker mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-ink-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-paper-cream border border-parchment rounded-md shadow-sm focus:outline-none focus:ring-leather focus:border-leather sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-ink-medium"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-paper-cream border border-parchment rounded-md shadow-sm focus:outline-none focus:ring-leather focus:border-leather sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bookmark-btn py-3 px-6 rounded-lg text-lg"
              >
                Sign In
              </button>
            </form>
            <div className="mt-4 text-center text-sm text-ink-medium">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-leather hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
