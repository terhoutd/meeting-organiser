import React, { useEffect, useRef, useState } from "react";
import ClockSvg from "../assets/ClockSvg";
import DescSvg from "../assets/DescSvg";
import InviteesSvg from "../assets/InviteesSvg";
import PinSvg from "../assets/PinSvg";
import PlanetSvg from "../assets/PlanetSvg";
import SmallArrowSvg from "../assets/SmallArrowSvg";
import { useVote } from "../context/VoteContext";
import ParticipantNameLabel from "./ParticipantNameLabel";
import { Participant } from "../others/Types";
import { durationsDetails } from "../others/helpers";

export default function EventMetaData({
  excludeParticipantCount,
}: {
  excludeParticipantCount?: boolean;
}) {
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isDescOverflowing, setIsDescOverflowing] = useState(false);
  const descRef = useRef(null);

  const { pollData, invitedParticipants, organizerParticipant, pageType } = useVote();
  console.log("pollData", pollData);
  if (!pollData) return <span>no data yet</span>;

  const participantsCount = invitedParticipants?.length;

  useEffect(() => {
    const textElement = descRef.current;
    if (textElement.scrollHeight > textElement.clientHeight) {
      setIsDescOverflowing(true);
    }
  }, [pollData.description]);

  //const includedParticipants = "3";
  function clickHandler() {
    setIsListExpanded(!isListExpanded);
  }
  return (
    <div className="relative flex flex-col">
      {pageType !== "poll overview" ? (
        <>
          <div className="flex justify-between">
            <div className="mb-2 lg:mb-2 ">
              <ParticipantNameLabel participant={organizerParticipant as Participant} />
            </div>
            <button
              className={`h-6 w-6 rounded-sm outline-blue-800 focus:outline lg:hidden`}
              onClick={clickHandler}
            >
              <SmallArrowSvg orientation={isListExpanded ? "up" : "down"} />
            </button>
          </div>
          <div className={` mb-2  text-lg font-medium lg:mb-2`}>{pollData.title}</div>
          <div className="mb-2  flex items-center gap-3  lg:mb-2">
            <ClockSvg />
            <span>
              {
                durationsDetails.find((x) => {
                  return x.duration == pollData.duration;
                })?.title
              }
            </span>
          </div>
        </>
      ) : (
        <>
          <div className={`mb-2 flex justify-between gap-3 lg:mb-2`}>
            <ParticipantNameLabel participant={organizerParticipant as Participant} />
            <button
              className={`h-6 w-6 rounded-sm outline-blue-800 focus:outline lg:hidden`}
              onClick={clickHandler}
            >
              <SmallArrowSvg orientation={isListExpanded ? "up" : "down"} />
            </button>
          </div>

          <div className="mb-2  flex items-center gap-3  lg:mb-2">
            <ClockSvg />
            <span>
              {
                durationsDetails.find((x) => {
                  return x.duration == pollData.duration;
                })?.title
              }
            </span>
          </div>
        </>
      )}

      <div className={isListExpanded ? "block" : "hidden lg:block"}>
        {pollData.location && (
          <div className={`mb-2 flex items-center gap-3 lg:mb-2 lg:flex`}>
            <PinSvg />
            <span>{pollData.location}</span>
          </div>
        )}
        {pollData.description && (
          <div className={`mb-2 flex  items-center  gap-3 lg:mb-2 `}>
            <DescSvg className="flex-shrink-0" />
            <div>
              <p ref={descRef} className={isDescExpanded ? "" : "line-clamp-4 overflow-hidden"}>
                <span>{pollData.description}</span>
              </p>
              {isDescOverflowing && (
                <span
                  className="cursor-pointer font-semibold text-zinc-600"
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                >
                  {isDescExpanded ? "Show Less" : "More"}
                </span>
              )}
            </div>
          </div>
        )}
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
