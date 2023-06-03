import React, { useState } from "react";
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
  showTip = true,
}: {
  left: PaginationButton;
  right: PaginationButton;
  options: number;
  className?: string;
  showLegend?: boolean;
  showTip?: boolean;
}) {
  return (
    <div className={`hidden px-4 lg:flex lg:p-0 ${showLegend ? "justify-between" : "justify-end"} relative`}>
      {showLegend && <ResponseLegend />}

      <div className={`${className ?? ""} flex items-center justify-end gap-2 pr-6`}>
        <span>{options} options</span>
        <PaginationButton onClick={left.onClick} direction={"left"} disabled={left.disabled} />
        <PaginationButton onClick={right.onClick} direction={"right"} disabled={right.disabled} />
      </div>
      {showTip && <PaginationTip />}
    </div>
  );
}

function PaginationButton({ disabled, onClick, direction }: PaginationButton) {
  return (
    <button
      className={` ${
        direction == "left" ? "rotate-180 " : ""
      }flex h-9  w-9 items-center justify-center border border-slate-300 hover:bg-gray-50 disabled:bg-slate-300 disabled:hover:bg-gray-100`}
      disabled={disabled}
      onClick={onClick}
    >
      <SmallArrowSvg />
    </button>
  );
}

function PaginationTip() {
  const [showTip, setShowTip] = useState(true);
  return !showTip ? null : (
    <div className=" absolute -top-[26px] right-[68px] z-40 flex h-[95px] w-[320px] flex-col justify-between  rounded-md bg-blue-600 py-3 px-4 text-white">
      <span className="self-start">More times are available</span>
      <button
        onClick={() => {
          setShowTip(false);
        }}
        className="self-end"
      >
        Got it
      </button>
      <div className="absolute top-[40px] right-[-6px] z-50 h-0 w-0 border-y-4 border-r-0 border-l-[6.9px] border-y-transparent border-r-transparent border-l-blue-600"></div>
    </div>
  );
}
