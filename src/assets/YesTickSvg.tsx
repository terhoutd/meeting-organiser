import React from "react";

export default function YesTickSvg({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-label="Checkmark"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.11116 10.4873C6.55466 9.8736 5.60604 9.82726 4.99237 10.3838C4.3787 10.9403 4.33235 11.8889 4.88886 12.5026L10.1231 18.2744L19.0471 9.57403C19.6403 8.99573 19.6524 8.04606 19.074 7.45289C18.4957 6.85971 17.5461 6.84766 16.9529 7.42597L10.2559 13.9551L7.11116 10.4873Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}
