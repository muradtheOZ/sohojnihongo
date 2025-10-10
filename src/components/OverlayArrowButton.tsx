// src/components/OverlayArrowButton.tsx
"use client";

import React from "react";

interface OverlayArrowButtonProps {
  onClick: () => void;
  position?: "center" | "middle-right" | "top-right" | "bottom-right";
  size?: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
  show?: boolean;
  hideOnDesktop?: boolean;
}

export default function OverlayArrowButton({
  onClick,
  position = "middle-right",
  size = "md",
  className = "",
  ariaLabel = "Next",
  show = true,
  hideOnDesktop = true,
}: OverlayArrowButtonProps) {
  if (!show) return null;

  // Position classes
  const positionClasses = {
    center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    "middle-right": "top-1/2 right-4 transform -translate-y-1/2",
    "top-right": "top-4 right-4",
    "bottom-right": "bottom-4 right-4",
  };

  // Size classes
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  // Arrow icon size
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const baseClasses = `
    absolute
    ${positionClasses[position]}
    ${sizeClasses[size]}
    rounded-full
    shadow-lg
    flex
    items-center
    justify-center
    z-20
    transition-all
    duration-200
    ${hideOnDesktop ? "md:hidden" : ""}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <button
      className={`${baseClasses} btn btn-accent btn-primary-custom ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg
        className={`${iconSizes[size]} text-white`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}
