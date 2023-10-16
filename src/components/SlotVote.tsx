import React, { useState } from "react";
import SlotDetails from "./SlotDetails";
import { NO_VOTE, YES_VOTE, IFNEEDBE_VOTE } from "../others/Constants";
import { FsSlot } from "../others/Types";
import YesTickSvg from "../assets/YesTickSvg";
import IfNeedBeSvg from "../assets/IfNeedBeSvg";
import clsx from "clsx";
import SlotYesCount from "./SlotYesCount";
import { useVote } from "../context/voteContext";
import NoTickSvg from "../assets/noTickSvg";

export default function SlotVote({
  slot,
  vote,
  setVote,
  variant = "vote",
}: {
  slot: FsSlot;
  vote: string;
  setVote: any;
  variant: "vote" | "read";
}) {
  function handleClick() {
    let newVote = NO_VOTE;
    if (isNoVote) newVote = YES_VOTE;
    if (isYesVote) newVote = IFNEEDBE_VOTE;
    if (isIfneedbeVote) newVote = NO_VOTE;
    setVote(newVote);
    console.log("click");
  }

  const canVote = variant == "vote";
  const { pollData } = useVote();

  const isNoVote = vote === NO_VOTE;
  const isYesVote = vote === YES_VOTE;
  const isIfneedbeVote = vote === IFNEEDBE_VOTE;
  return (
    <label
      onClick={handleClick}
      className={clsx(
        "flex cursor-pointer	items-center justify-between  border-b border-slate-300 p-4 lg:flex-col lg:justify-evenly lg:border-0 lg:p-0 lg:pt-4",
        canVote && isNoVote && " hover:bg-gray-50",
        canVote && isYesVote && " bg-lime-100",
        canVote && isIfneedbeVote && " bg-amber-200"
      )}
    >
      <SlotDetails event={slot} />
      <div className="flex items-center">
        {!canVote && (
          <div className="mr-5  w-6">
            {isYesVote && <YesTickSvg className={"w-4 text-green-700"} />}
            {isIfneedbeVote && <IfNeedBeSvg className={"w-6 text-green-700"} />}
            {isNoVote && <NoTickSvg className={"w-6 text-zinc-400"} />}
          </div>
        )}

        <div className="mr-2 lg:hidden ">
          <SlotYesCount className="text-blue-800" key={slot.id} slotId={slot.id} participants={pollData.participants} />
        </div>

        {/* tickbox and its status */}
        {canVote && (
          <div className={clsx("my-3 flex h-6 w-6 justify-center rounded border border-gray-500 bg-white")}>
            {isYesVote && <YesTickSvg className="w-4 bg-white text-lime-500" />}
            {isIfneedbeVote && <IfNeedBeSvg className="w-4 bg-white" />}
          </div>
        )}
      </div>
    </label>
  );
}
