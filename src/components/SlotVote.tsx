import React, { useState } from "react";
import SlotDetails from "./SlotDetails";
import { NO_VOTE, YES_VOTE, IFNEEDBE_VOTE } from "../others/Constants";
import { FsSlot } from "../others/Types";
import YesTickSvg from "../assets/YesTickSvg";
import IfNeedBeSvg from "../assets/IfNeedBeSvg";
import clsx from "clsx";
import SlotYesCount from "./SlotYesCount";
import { useVote } from "../context/voteContext";

export default function SlotVote({ slot, vote, setVote }: { event: FsSlot; vote: string; setVote: any }) {
  function handleClick() {
    let newVote = NO_VOTE;
    if (isNoVote) newVote = YES_VOTE;
    if (isYesVote) newVote = IFNEEDBE_VOTE;
    if (isIfneedbeVote) newVote = NO_VOTE;
    setVote(newVote);
    console.log("click");
  }
  const { pollData, invitedParticipants, organizerParticipant } = useVote();

  const isNoVote = vote === NO_VOTE;
  const isYesVote = vote === YES_VOTE;
  const isIfneedbeVote = vote === IFNEEDBE_VOTE;
  return (
    <label
      onClick={handleClick}
      className={clsx(
        "flex cursor-pointer	items-center border-b  border-slate-300 p-4 lg:flex-col lg:justify-evenly lg:border-0 lg:p-0",
        isNoVote && " hover:bg-gray-50",
        isYesVote && " bg-lime-100",
        isIfneedbeVote && " bg-amber-200"
      )}
    >
      <SlotDetails event={slot} />
      <div className="mr-2 lg:hidden ">
        <SlotYesCount key={slot.id} slotId={slot.id} participants={invitedParticipants} />
      </div>

      <div className={clsx("my-3 flex h-6 w-6 justify-center rounded border border-gray-500 bg-white")}>
        {isYesVote && <YesTickSvg className="w-4 bg-white text-lime-500" />}
        {isIfneedbeVote && <IfNeedBeSvg className="w-4 bg-white" />}
      </div>
    </label>
  );
}
