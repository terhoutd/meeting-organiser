import React from "react";
import { Participant } from "../others/Types";
import clsx from "clsx";
export default function ParticipantNameLabel({ participant }: { participant: Participant }) {
  return (
    <div className=" flex w-full items-center justify-start gap-2">
      <span className="flex h-10 w-10 items-center justify-center justify-center  rounded-full bg-sky-100">
        {participant.name.charAt(0)}
      </span>
      <span className="flex flex-col items-start">
        <div className={clsx("justify-self-start", participant.isOrganiser && "font-bold")}>{participant.name}</div>
        {participant.isOrganiser && <div className={clsx("justify-self-start")}>Organizer</div>}
      </span>
    </div>
  );
}
