import React from "react";

export default function DescSvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-label="List"
      aria-hidden="true"
      width="16"
      height="16"
      className={className}
    >
      <path
        d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
