import React from "react";
type ParticipationHeadersProps = {
  mainText: string;
  subText?: string;
};
export default function ParticipationHeaders({ mainText, subText }: ParticipationHeadersProps) {
  return (
    <div className="mb-4   border-slate-300 pt-4   lg:mb-0 lg:border-0 lg:p-0">
      <h1
        className=" mb-2 text-lg font-medium lg:text-[27px] lg:font-normal"
        data-testid="instructions-main-title"
      >
        {mainText}
      </h1>
      <p className=" mt-3  mb-2">{subText}</p>
    </div>
  );
}
