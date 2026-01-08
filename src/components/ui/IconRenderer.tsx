"use client";

import {
    BookIcon,
    FlameIcon,
    MoonIcon,
    MountainIcon,
    TowerIcon,
    WallIcon,
    FilmIcon,
    PlaneIcon,
    RunnerIcon,
    OwlIcon,
    BirdIcon,
    SwordIcon,
    StackIcon,
    SparkleIcon,
  } from "@/components/ui/Icons";
  
  export function IconRenderer({ icon, size = 48, className = "" }: { icon: string; size?: number; className?: string }) {
    const iconMap: Record<string, React.ReactNode> = {
      moon: <MoonIcon size={size} className={className} />,
      mountain: <MountainIcon size={size} className={className} />,
      tower: <TowerIcon size={size} className={className} />,
      wall: <WallIcon size={size} className={className} />,
      film: <FilmIcon size={size} className={className} />,
      plane: <PlaneIcon size={size} className={className} />,
      runner: <RunnerIcon size={size} className={className} />,
      flame: <FlameIcon size={size} className={className} />,
      owl: <OwlIcon size={size} className={className} />,
      bird: <BirdIcon size={size} className={className} />,
      sword: <SwordIcon size={size} className={className} />,
      stack: <StackIcon size={size} className={className} />,
      sparkle: <SparkleIcon size={size} className={className} />,
      book: <BookIcon size={size} className={className} />,
    };
  
    return iconMap[icon] || <BookIcon size={size} className={className} />;
  }
