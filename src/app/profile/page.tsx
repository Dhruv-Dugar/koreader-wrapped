"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { BookIcon, LoaderIcon } from "@/components/ui/Icons";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [privacy, setPrivacy] = useState("private");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      // Fetch user's current privacy setting
      fetch("/api/user/privacy")
        .then((res) => res.json())
        .then((data) => {
          setPrivacy(data.privacy);
          setLoading(false);
        });
    }
  }, [status]);

  const handlePrivacyChange = async (newPrivacy: string) => {
    setPrivacy(newPrivacy);
    await fetch("/api/user/privacy", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ privacy: newPrivacy }),
    });
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen text-ink-dark flex items-center justify-center">
        <LoaderIcon size={40} className="text-leather" />
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen text-ink-dark flex items-center justify-center">
        <p>Redirecting to sign in...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-ink-dark flex flex-col pt-20">
      <div className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold mb-4">
              Profile
            </h1>
          </div>
          <div className="book-card rounded-xl p-8">
            <h2 className="font-semibold text-lg mb-4">Privacy Settings</h2>
            <div className="flex items-center justify-between">
              <p>Leaderboard Participation</p>
              <select
                value={privacy}
                onChange={(e) => handlePrivacyChange(e.target.value)}
                className="bg-paper-sepia border border-parchment rounded-md px-2 py-1 text-sm text-ink-dark"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <p className="text-sm text-ink-light mt-2">
              If set to public, your name will appear on the leaderboard.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
