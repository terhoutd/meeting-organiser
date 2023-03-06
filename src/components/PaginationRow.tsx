import React from "react";
import SmallArrowSvg from "../assets/SmallArrowSvg";
import TickboxIfneedbe from "./TickboxIfneedbe";
import TickBoxNo from "./TickBoxNo";
import TickBoxQuestion from "./TickBoxQuestion";
import TickBoxYes from "./TickBoxYes";

type PaginationButton = {
  onClick: () => void;
  disabled: boolean;
  direction?: "left" | "right";
};

export default function PaginationRow({
  left,
  right,
  options,
  className,
  showLegend,
}: {
  left: PaginationButton;
  right: PaginationButton;
  options: number;
  className?: string;
  showLegend?: boolean;
}) {
  return (
    <div className={`flex px-4 ${showLegend ? "justify-between" : "justify-end"}`}>
      <div className={`${showLegend ? "flex gap-2" : "hidden"}`}>
        <TickBoxYes variant="legend" />
        <TickboxIfneedbe variant="legend" />
        <TickBoxNo variant="legend" />
        <TickBoxQuestion variant="legend" />
      </div>
      <div className={`${className ?? ""} flex items-center justify-end gap-2`}>
        <span>{options} options</span>
        <PaginationButton onClick={left.onClick} direction={"left"} disabled={left.disabled} />
        <PaginationButton onClick={right.onClick} direction={"right"} disabled={right.disabled} />
      </div>
    </div>
  );
}

function PaginationButton({ disabled, onClick, direction }: PaginationButton) {
  return (
    <button
      className={` ${
        direction == "left" ? "rotate-180 " : ""
      }flex h-9 w-9  items-center justify-center border border-slate-300 hover:bg-gray-50 disabled:bg-slate-300 disabled:hover:bg-gray-100`}
      disabled={disabled}
      onClick={onClick}
    >
      <SmallArrowSvg />
    </button>
  );
}
