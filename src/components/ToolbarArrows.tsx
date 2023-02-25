import React from "react";
import ArrowSvg from "../assets/ArrowSvg";
import clsx from "clsx";
export function ToolbarArrows({
  // date, // available, but not used here
  onClickHandler,
  ariaLabel,
  rotation,
}: {
  onClickHandler: () => {};
  ariaLabel: string;
  rotation?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClickHandler}
      aria-label={ariaLabel}
      className={clsx("h-12 w-12  border-2 border-blue-600 align-bottom text-blue-600", {
        "rotate-180": rotation === "right",
      })}
    >
      <ArrowSvg />
    </button>
  );
}
