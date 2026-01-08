"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookIcon } from "@/components/ui/Icons";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        // Automatically sign in after successful registration
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
           // Should not happen if registration was successful, but handle it
           setError("Registration successful, but failed to sign in automatically. Please sign in.");
           setTimeout(() => router.push("/auth/signin"), 2000);
        } else {
           router.push("/upload");
        }
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <main className="min-h-screen text-ink-dark flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="book-card rounded-xl p-8">
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-6 text-center">
              Create Account
            </h1>
            {error && <p className="text-bookmarker mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-ink-medium"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-paper-cream border border-parchment rounded-md shadow-sm focus:outline-none focus:ring-leather focus:border-leather sm:text-sm"
                />
              </div>
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
                Sign Up
              </button>
            </form>
             <div className="mt-4 text-center text-sm text-ink-medium">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-leather hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
