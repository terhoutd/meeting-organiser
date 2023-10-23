import React from "react";
import { FsSlot, PollData } from "../others/Types";
import ParticipantNameLabel from "./ParticipantNameLabel";
import SlotYesCount from "./SlotYesCount";
import TickBox from "./TickBox";
import { useVote } from "../context/voteContext";

export default function ResponsesTable({
  pollData,
  displayedSlotsIds,
  variant = "vote",
  currentParticipantPosition = "exclude",
  countIcon = "tick",
}: {
  pollData: PollData;
  displayedSlotsIds: any[];
  variant?: string;
  currentParticipantPosition?: "exclude" | "top";
  countIcon?: "tick" | "people";
}) {
  const { participant } = useVote();

  console.log("displayedSlotsIds", displayedSlotsIds);
  let sortedIncludedParticipants = [
    ...pollData.participants.filter((p) => {
      if (participant && currentParticipantPosition == "exclude") return p.email !== participant.email;
      return true;
    }),
  ];
  const displayedSlots = pollData.slots.filter((s) => displayedSlotsIds.includes(s.id));

  sortedIncludedParticipants.sort((a, b) => {
    if (currentParticipantPosition == "top" && a.email === participant.email) return -1;
    if (a.isOrganiser) return -1;
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0; // names must be equal
  });
  // return (
  //   <>
  //     <div></div>
  //     {displayedSlots.map((s) => {
  //       return <SlotYesCount key={s.id} slotId={s.id} participants={sortedIncludedParticipants} />;
  //     })}
  //     <div
  //       style={{ gridColumn: "1 / -1", width: "700px", height: "200px",gridArea:'otherRespondants', backgroundColor: "red" }}
  //     ></div>
  //   </>
  // );
  return (
    <>
      <div
        style={{
          gridArea: "yes-count",
          gridTemplateColumns: `repeat(${displayedSlotsIds.length},90px)`,
          // gap: " 10px",
          placeItems: "center",
        }}
        className="hidden lg:grid  lg:overflow-y-auto"
      >
        {displayedSlots.map((s) => {
          return (
            <SlotYesCount key={s.id} slotId={s.id} participants={sortedIncludedParticipants} countIcon={countIcon} />
          );
        })}
      </div>
      <div
        style={{
          gridArea: "participants",
          gridTemplateColumns: `228px 470px`,
          gridTemplateRows: `repeat(${sortedIncludedParticipants.length}, 48px)`,
          // height: "216px",
          overflowY: "auto",
          gap: " 8px 0",
          // placeItems: "center",
          // paddingRight: "40px",
        }}
        className="hidden lg:grid lg:h-[205px]"
      >
        {sortedIncludedParticipants.map((participant) => (
          <React.Fragment key={participant.email}>
            <ParticipantNameLabel participant={participant} />
            <div className="flex flex-row">
              {displayedSlots.map((ev) => {
                const userVoteforEvent = participant.responses.find((uv) => uv.id === ev.id)?.response;
                const key = ev.id;
                return <TickBox type={userVoteforEvent || "question"} variant="table" key={key} />;
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
