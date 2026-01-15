"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { BookIcon, TrophyIcon, FileIcon } from "@/components/ui/Icons";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const navLinks = [
    { href: "/upload", label: "Upload", icon: FileIcon },
    { href: "/history", label: "History", icon: BookIcon },
    { href: "/leaderboard", label: "Leaderboard", icon: TrophyIcon },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-paper-cream/85 backdrop-blur-xl border-b border-parchment shadow-sm py-2"
            : "bg-transparent py-4 border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 text-ink-dark hover:text-leather transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                scrolled ? "bg-paper-sepia border border-parchment" : "bg-white/80 border border-white/20 shadow-lg backdrop-blur-md"
              }`}>
                <BookIcon size={20} className="text-leather group-hover:scale-110 transition-transform" />
              </div>
              <span className={`serif-heading font-bold text-xl tracking-tight ${!scrolled && pathname === '/' ? "text-ink-dark drop-shadow-sm" : ""}`}>
                KoReader <span className="font-normal italic">Wrapped</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all ${
                      isActive 
                        ? "text-leather bg-paper-sepia/50" 
                        : "text-ink-medium hover:text-ink-dark hover:bg-parchment/30"
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-parchment pointer-events-none"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
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
                    className={`text-sm font-semibold tracking-wide transition-all px-4 py-2 rounded-full hover:bg-parchment/30 ${
                      pathname === "/profile" ? "text-leather" : "text-ink-medium"
                    }`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm font-semibold tracking-wide text-ink-medium hover:text-bookmarker transition-all px-4 py-2 hover:bg-parchment/30 rounded-full"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="bookmark-btn py-2.5 px-6 rounded-full text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-ink-dark hover:bg-parchment/50 rounded-full transition-colors"
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
              className="md:hidden bg-paper-cream border-b border-parchment overflow-hidden absolute top-full left-0 w-full shadow-xl"
            >
              <div className="p-4 space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        isActive ? "bg-paper-sepia text-leather border border-parchment" : "text-ink-medium hover:bg-parchment/30"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}
                
                <div className="border-t border-parchment my-2 pt-2">
                  {session ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          pathname === "/profile" ? "bg-paper-sepia text-leather" : "text-ink-medium hover:bg-parchment/30"
                        }`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          setIsOpen(false);
                        }}
                        className="w-full text-left flex items-center gap-3 p-3 rounded-xl text-ink-medium hover:bg-parchment/30 hover:text-bookmarker"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Sign Out
                      </button>
                    </>
                  ) : (
                     <Link
                      href="/auth/signin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full bookmark-btn py-3 px-4 rounded-xl text-sm shadow-sm mt-4"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Spacer to prevent content from jumping when nav becomes fixed if we weren't using overlay. 
          But since we are using fixed, we might need padding on the body or the first section.
          The hero section has min-h-[90vh] so it should be fine. */}
    </>
  );
}
