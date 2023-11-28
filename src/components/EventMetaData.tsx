import React, { useState } from "react";
import ClockSvg from "../assets/ClockSvg";
import DescSvg from "../assets/DescSvg";
import InviteesSvg from "../assets/InviteesSvg";
import PinSvg from "../assets/PinSvg";
import PlanetSvg from "../assets/PlanetSvg";
import SmallArrowSvg from "../assets/SmallArrowSvg";
import { useVote } from "../context/voteContext";
import ParticipantNameLabel from "./ParticipantNameLabel";
import { Participant } from "../others/Types";

export default function EventMetaData({
  excludeParticipantCount,
}: {
  excludeParticipantCount?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { pollData, invitedParticipants, organizerParticipant } = useVote();
  console.log("pollData", pollData);
  if (!pollData) return <span>no data yet</span>;

  const participantsCount = invitedParticipants?.length;
  //const includedParticipants = "3";
  function clickHandler() {
    setIsExpanded(!isExpanded);
  }
  return (
    <div className="relative flex flex-col">
      <button
        className={`absolute top-3 right-3 h-6 w-6 rounded-sm outline-blue-800 focus:outline lg:hidden`}
        onClick={clickHandler}
      >
        <SmallArrowSvg orientation={isExpanded ? "up" : "down"} />
      </button>
      <div className="mb-2 lg:mb-2 ">
        <ParticipantNameLabel participant={organizerParticipant as Participant} />
      </div>
      <div className={` mb-2  text-lg font-medium lg:mb-2`}>{pollData.title}</div>
      <div className="mb-2  flex items-center gap-3  lg:mb-2">
        <ClockSvg />
        <span>30 minutes</span>
      </div>
      <div className={`${isExpanded ? "flex" : "hidden"} mb-2 items-center gap-3 lg:mb-2 lg:flex`}>
        <PinSvg />
        <span>bla</span>
      </div>
      <div
        className={`${isExpanded ? "flex" : "hidden"} mb-2  items-center  gap-3 lg:mb-2 lg:flex`}
      >
        <PlanetSvg />
        <span>uk</span>
      </div>
      <div
        className={`${isExpanded ? "flex" : "hidden"} mb-2  items-center  gap-3 lg:mb-2 lg:flex`}
      >
        <DescSvg />
        <span>description</span>
      </div>
      {!excludeParticipantCount && participantsCount > 0 && (
        <div className={`mb-2 flex items-center gap-3  lg:mb-2`}>
          <InviteesSvg />
          <span>
            {participantsCount.toString()} of {participantsCount.toString()} invitees responded
          </span>
        </div>
      )}
    </div>
  );
}
