"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { BookIcon, TrophyIcon, FileIcon } from "@/components/ui/Icons";

// Adding missing icons locally if they don't exist in Icons.tsx yet
// (I will assume basic ones exist or I will stick to text for simplicity if needed, but I saw BookIcon, TrophyIcon)
// Let's check if UserIcon, MenuIcon, XIcon, HistoryIcon exist. 
// Looking at the previous read_file output, they do NOT exist.
// I will add them to the Icons.tsx file first, or just define simple SVG placeholders inside Navbar for now to save tokens/time, 
// OR better yet, I will update Icons.tsx properly.

// Let's use what we have or add what we need.
// Available: BookIcon, TrophyIcon, UploadIcon (for upload), 
// Missing: UserIcon (Profile), HistoryIcon (History), MenuIcon (Hamburger), XIcon (Close)

// I will assume I can add them to Icons.tsx first.
export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/upload", label: "Upload", icon: FileIcon },
    { href: "/history", label: "History", icon: BookIcon }, // Reusing BookIcon for History as placeholder if needed
    { href: "/leaderboard", label: "Leaderboard", icon: TrophyIcon },
  ];

  return (
    <nav className="bg-paper-cream border-b border-parchment sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-ink-dark hover:text-leather transition-colors">
            <BookIcon size={24} className="text-leather" />
            <span className="font-[family-name:var(--font-playfair)] font-bold text-xl">KoReader Wrapped</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive ? "text-leather" : "text-ink-medium hover:text-ink-dark"
                  }`}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-parchment animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-4">
                 <Link
                  href="/profile"
                  className={`text-sm font-medium transition-colors ${
                    pathname === "/profile" ? "text-leather" : "text-ink-medium hover:text-ink-dark"
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm font-medium text-ink-medium hover:text-bookmarker transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bookmark-btn py-2 px-4 rounded-lg text-sm shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-ink-dark hover:bg-parchment rounded-md transition-colors"
          >
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-parchment bg-paper-cream overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 p-2 rounded-md ${
                      isActive ? "bg-parchment text-leather" : "text-ink-medium hover:bg-parchment/50"
                    }`}
                  >
                    <Icon size={20} />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="border-t border-parchment my-2 pt-2">
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 p-2 rounded-md ${
                        pathname === "/profile" ? "bg-parchment text-leather" : "text-ink-medium hover:bg-parchment/50"
                      }`}
                    >
                      {/* Simple User Icon SVG */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-3 p-2 rounded-md text-ink-medium hover:bg-parchment/50 hover:text-bookmarker"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      Sign Out
                    </button>
                  </>
                ) : (
                   <Link
                    href="/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full bookmark-btn py-3 px-4 rounded-lg text-sm shadow-sm mt-4"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
