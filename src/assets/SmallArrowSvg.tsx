import React from "react";

export default function SmallArrowSvg({ orientation }: { orientation?: "left" | "right" | "down" | "up" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-label="ChevronRight"
      aria-hidden="true"
      width="24"
      height="24"
      className={`
      ${orientation == "down" ? "rotate-90" : ""} 
      ${orientation == "left" ? "rotate-180" : ""} 
      ${orientation == "up" ? "-rotate-90" : ""}`}
    >
      <path d="m8.59 16.34 4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" fill="currentColor"></path>
    </svg>
  );
}
