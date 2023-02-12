import React, { useState } from "react";
import SlotTableHeader from "./SlotTableHeader";
import { NO_VOTE, YES_VOTE, IFNEEDBE_VOTE } from "./Constants";
import { FsCalEvent } from "./Types";
import YesTickSvg from "./assets/YesTickSvg";
import IfNeedBeSvg from "./assets/IfNeedBeSvg";
import clsx from "clsx";

export default function SlotVote({ event, vote, setVote }: { event: FsCalEvent; vote: string; setVote: any }) {
  function handleClick() {
    let newVote = NO_VOTE;
    if (vote === NO_VOTE) newVote = YES_VOTE;
    if (vote === YES_VOTE) newVote = IFNEEDBE_VOTE;
    if (vote === IFNEEDBE_VOTE) newVote = NO_VOTE;
    setVote(newVote);
    console.log("click");
  }
  return (
    <div onClick={handleClick} className="hover:bg-purple-300 flex flex-col items-center">
      <SlotTableHeader event={event} />
      <div className={clsx("border-2 h-6 w-6 rounded", vote === IFNEEDBE_VOTE ? "p-1" : "")}>
        {vote === YES_VOTE ? <YesTickSvg pxSize="" className="text-lime-500 bg-white" /> : ""}
        {vote === IFNEEDBE_VOTE ? <IfNeedBeSvg pxSize="" className="bg-white" /> : ""}
      </div>
      <div>{vote}</div>
    </div>
  );
}
