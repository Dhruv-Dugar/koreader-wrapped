"use client";

import { motion } from "framer-motion";

interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

const defaultProps = {
  size: 24,
  strokeWidth: 1.5,
};

// Book icon - open book
export function BookIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </motion.svg>
  );
}

// Flame icon - for streaks
export function FlameIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </motion.svg>
  );
}

// Moon icon - for night owl
export function MoonIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ rotate: 15 }}
      transition={{ duration: 0.3 }}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </motion.svg>
  );
}

// Sun icon - for early bird
export function SunIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ rotate: 45 }}
      transition={{ duration: 0.3 }}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </motion.svg>
  );
}

// Mountain icon - for character comparisons
export function MountainIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </motion.svg>
  );
}

// Film icon - for movie comparisons
export function FilmIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </motion.svg>
  );
}

// Clock icon - for time
export function ClockIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ rotate: 15 }}
      transition={{ duration: 0.2 }}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </motion.svg>
  );
}

// Trophy icon - for achievements
export function TrophyIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </motion.svg>
  );
}

// Share icon
export function ShareIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ x: 2, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </motion.svg>
  );
}

// Owl icon - for night owl persona
export function OwlIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ rotate: [-5, 5, -5, 0] }}
      transition={{ duration: 0.4 }}
    >
      <path d="M12 3c-1.5 0-3 .5-4 1.5L6 3v3.5C4.5 8 4 10 4 12c0 4.42 3.58 8 8 8s8-3.58 8-8c0-2-.5-4-2-5.5V3l-2 1.5c-1-.5-2.5-1.5-4-1.5z" />
      <circle cx="9" cy="11" r="1.5" />
      <circle cx="15" cy="11" r="1.5" />
      <path d="M12 16c1 0 2-.5 2-1.5S13 13 12 13s-2 .5-2 1.5.5 1.5 2 1.5z" />
    </motion.svg>
  );
}

// Bird icon - for early bird persona
export function BirdIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ x: 3 }}
      transition={{ duration: 0.2 }}
    >
      <path d="M16 7h.01" />
      <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
      <path d="m20 7 2 .5-2 .5" />
      <path d="M10 18v3" />
      <path d="M14 17.75V21" />
      <path d="M7 18a6 6 0 0 0 3.84-10.61" />
    </motion.svg>
  );
}

// Sword icon - for weekend warrior
export function SwordIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ rotate: 15 }}
      transition={{ duration: 0.2 }}
    >
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <line x1="19" y1="21" x2="21" y2="19" />
    </motion.svg>
  );
}

// Stack icon - for consistent reader (books stacked)
export function StackIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <path d="M4 10h16" />
      <path d="M4 14h16" />
      <path d="M4 18h16" />
      <path d="M4 6h16" />
    </motion.svg>
  );
}

// Sparkle icon - for binge reader
export function SparkleIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ scale: 1.1, rotate: 15 }}
      transition={{ duration: 0.2 }}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </motion.svg>
  );
}

// Plane icon - for around the world comparison
export function PlaneIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ x: 3, y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </motion.svg>
  );
}

// Runner icon - for marathon comparison
export function RunnerIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ x: 3 }}
      transition={{ duration: 0.2 }}
    >
      <circle cx="17" cy="4" r="2" />
      <path d="M15.59 13.51 10 17l-5 3" />
      <path d="m10 17 1.5-2.5" />
      <path d="m14 17 1.5-2.5" />
      <path d="M3.5 21a6.5 6.5 0 0 1 6.5-6.5h.5" />
      <path d="m15.5 17.5.5 2.5" />
      <path d="M7 10 9 6l6.5 1" />
    </motion.svg>
  );
}

// Tower icon - for Eiffel Tower comparison
export function TowerIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <path d="M12 2v2" />
      <path d="M8 4h8l-1 4H9L8 4z" />
      <path d="M9 8l-2 6h10l-2-6" />
      <path d="M7 14l-3 8h16l-3-8" />
      <path d="M10 14v8" />
      <path d="M14 14v8" />
    </motion.svg>
  );
}

// Wall icon - for Great Wall comparison
export function WallIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <rect x="2" y="6" width="4" height="4" />
      <rect x="6" y="6" width="4" height="4" />
      <rect x="10" y="6" width="4" height="4" />
      <rect x="14" y="6" width="4" height="4" />
      <rect x="18" y="6" width="4" height="4" />
      <rect x="4" y="10" width="4" height="4" />
      <rect x="8" y="10" width="4" height="4" />
      <rect x="12" y="10" width="4" height="4" />
      <rect x="16" y="10" width="4" height="4" />
      <rect x="2" y="14" width="4" height="4" />
      <rect x="6" y="14" width="4" height="4" />
      <rect x="10" y="14" width="4" height="4" />
      <rect x="14" y="14" width="4" height="4" />
      <rect x="18" y="14" width="4" height="4" />
    </motion.svg>
  );
}

// Award icon
export function AwardIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ y: -2, rotate: 5 }}
      transition={{ duration: 0.2 }}
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </motion.svg>
  );
}

// Arrow right icon
export function ArrowRightIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ x: 3 }}
      transition={{ duration: 0.2 }}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </motion.svg>
  );
}

// Download icon
export function DownloadIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ y: 2 }}
      transition={{ duration: 0.2 }}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </motion.svg>
  );
}

// Chevron icons
export function ChevronLeftIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function ChevronRightIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// Upload/File icons
export function UploadIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </motion.svg>
  );
}

export function FileIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </motion.svg>
  );
}

// Check and Alert icons
export function CheckCircleIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </motion.svg>
  );
}

export function AlertCircleIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </motion.svg>
  );
}

// Loader icon
export function LoaderIcon({ className, size = defaultProps.size, strokeWidth = defaultProps.strokeWidth }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </motion.svg>
  );
}
