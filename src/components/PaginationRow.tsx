import React from "react";
import SmallArrowSvg from "../assets/SmallArrowSvg";
import ResponseLegend from "./ResponseLegend";
import TickBox from "./TickBox";

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
    <div className={`hidden px-4 lg:flex ${showLegend ? "justify-between" : "justify-end"}`}>
      {showLegend && <ResponseLegend />}

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
