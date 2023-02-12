import React from "react";

export default function QuestionSvg({ pxSize, className }: { pxSize: string; className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path
          d="M7.456 12.421c.745 0 1.35.591 1.35 1.32 0 .729-.605 1.32-1.35 1.32-.745 0-1.35-.591-1.35-1.32 0-.729.605-1.32 1.35-1.32Zm.592-11.36c4.107 0 6.026 5.458 2.61 7.83-.057.04-.8.544-.971.669-.763.557-.957.933-.957 2.227H6.205c0-2.105.583-3.236 1.993-4.266.213-.156.995-.685 1.02-.703 1.334-.927.523-3.233-1.17-3.233-1.68 0-2.526 1.941-1.52 3.278L4.512 8.381c-2.213-2.942-.306-7.32 3.537-7.32Z"
          id="d_pending-vote_svg__a"
        ></path>
      </defs>
      <use fill="currentColor" xlink:href="#d_pending-vote_svg__a" transform="translate(4 4)" fillRule="evenodd"></use>
    </svg>
  );
}
