"use client";

import { forwardRef } from "react";
import { ProcessedStats } from "@/types";
import { formatReadingTime } from "@/lib/comparisons";

interface ShareCardProps {
  stats: ProcessedStats;
  year?: number;
}

/**
 * ShareCard - A static card optimized for image export
 * Dimensions: 1080x1080 (Instagram square) or 1200x630 (Twitter/OG)
 * This component renders without animations for clean image capture
 */
export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ stats, year }, ref) {
    const currentYear = year || new Date().getFullYear();
    const topBook = stats.topBooks[0];

    return (
      <div
        ref={ref}
        className="share-card"
        style={{
          width: "1080px",
          height: "1080px",
          padding: "60px",
          background: "linear-gradient(135deg, #faf6f1 0%, #f4eee5 50%, #e8dfd3 100%)",
          fontFamily: "'Playfair Display', Georgia, serif",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative corner elements */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            left: "30px",
            width: "60px",
            height: "60px",
            borderTop: "3px solid #8b5a2b",
            borderLeft: "3px solid #8b5a2b",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "30px",
            width: "60px",
            height: "60px",
            borderTop: "3px solid #8b5a2b",
            borderRight: "3px solid #8b5a2b",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "30px",
            width: "60px",
            height: "60px",
            borderBottom: "3px solid #8b5a2b",
            borderLeft: "3px solid #8b5a2b",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "30px",
            width: "60px",
            height: "60px",
            borderBottom: "3px solid #8b5a2b",
            borderRight: "3px solid #8b5a2b",
          }}
        />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "2px",
                background: "linear-gradient(to right, transparent, #8b5a2b)",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "#8b7355",
              }}
            >
              My {currentYear} Reading Journey
            </span>
            <div
              style={{
                width: "80px",
                height: "2px",
                background: "linear-gradient(to left, transparent, #8b5a2b)",
              }}
            />
          </div>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "700",
              color: "#2c1810",
              margin: "0",
              lineHeight: "1.2",
            }}
          >
            KoReader Wrapped
          </h1>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "40px",
          }}
        >
          <StatCard
            value={stats.core.totalBooksStarted.toString()}
            label="Books Read"
            color="#8b5a2b"
          />
          <StatCard
            value={stats.core.totalPagesRead.toLocaleString()}
            label="Pages Turned"
            color="#2d5a3d"
          />
          <StatCard
            value={formatReadingTime(stats.core.totalReadingTimeSeconds)}
            label="Time Reading"
            color="#c9a227"
          />
          <StatCard
            value={`${stats.core.longestStreak} days`}
            label="Longest Streak"
            color="#c41e3a"
          />
        </div>

        {/* Reader Persona */}
        <div
          style={{
            background: "rgba(139, 90, 43, 0.08)",
            borderRadius: "16px",
            padding: "32px",
            textAlign: "center",
            marginBottom: "40px",
            border: "1px solid rgba(139, 90, 43, 0.2)",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              color: "#8b7355",
              margin: "0 0 8px 0",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            I&apos;m a
          </p>
          <p
            style={{
              fontSize: "42px",
              fontWeight: "700",
              color: "#8b5a2b",
              margin: "0",
            }}
          >
            {stats.fun.readerPersona.type}
          </p>
        </div>

        {/* Top Book */}
        {topBook && (
          <div
            style={{
              background: "rgba(45, 90, 61, 0.08)",
              borderRadius: "16px",
              padding: "24px 32px",
              marginBottom: "40px",
              border: "1px solid rgba(45, 90, 61, 0.2)",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#8b7355",
                margin: "0 0 8px 0",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Most Time Spent On
            </p>
            <p
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#2c1810",
                margin: "0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {topBook.book.title}
            </p>
            <p
              style={{
                fontSize: "18px",
                color: "#5c4033",
                margin: "8px 0 0 0",
              }}
            >
              {topBook.hoursRead.toFixed(1)} hours
            </p>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              color: "#8b7355",
              margin: "0",
            }}
          >
            Generated with{" "}
            <span style={{ color: "#8b5a2b", fontWeight: "600" }}>
              kowrapped.netlify.com
            </span>
          </p>
        </div>
      </div>
    );
  }
);

function StatCard({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "32px",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(44, 24, 16, 0.06)",
        border: "1px solid #e8dfd3",
      }}
    >
      <p
        style={{
          fontSize: "48px",
          fontWeight: "700",
          color: color,
          margin: "0",
          lineHeight: "1",
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: "16px",
          color: "#5c4033",
          margin: "12px 0 0 0",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {label}
      </p>
    </div>
  );
}

export default ShareCard;
