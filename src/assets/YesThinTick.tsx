import React from "react";

export default function YesThinTick({ className }: { className: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-label="Check"
      aria-hidden="true"
      width="20"
      height="20"
    >
      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"></path>
    </svg>
  );
}
