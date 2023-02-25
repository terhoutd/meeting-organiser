import React, { useState } from "react";
import SlotDetails from "./SlotDetails";
import { NO_VOTE, YES_VOTE, IFNEEDBE_VOTE } from "../others/Constants";
import { FsSlot } from "../others/Types";
import YesTickSvg from "../assets/YesTickSvg";
import IfNeedBeSvg from "../assets/IfNeedBeSvg";
import clsx from "clsx";

export default function SlotVote({ event, vote, setVote }: { event: FsSlot; vote: string; setVote: any }) {
  function handleClick() {
    let newVote = NO_VOTE;
    if (isNoVote) newVote = YES_VOTE;
    if (isYesVote) newVote = IFNEEDBE_VOTE;
    if (isIfneedbeVote) newVote = NO_VOTE;
    setVote(newVote);
    console.log("click");
  }
  const isNoVote = vote === NO_VOTE;
  const isYesVote = vote === YES_VOTE;
  const isIfneedbeVote = vote === IFNEEDBE_VOTE;
  return (
    <div
      onClick={handleClick}
      className={clsx(
        "flex	cursor-pointer flex-col items-center",
        isNoVote && " hover:bg-gray-50",
        isYesVote && " hover:bg-lime-100",
        isIfneedbeVote && " hover:bg-amber-200"
      )}
    >
      <SlotDetails event={event} />
      <div className={clsx("flex h-6 w-6 justify-center rounded border border-gray-500 bg-white")}>
        {isYesVote && <YesTickSvg className="w-4 bg-white text-lime-500" />}
        {isIfneedbeVote && <IfNeedBeSvg className="w-4 bg-white" />}
      </div>
    </div>
  );
}
