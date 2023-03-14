import React, { useState } from "react";
import { useVote } from "../context/voteContext";
import { FsSlot, ParticipantFullInfo } from "../others/Types";
import PaginationRow from "./PaginationRow";
import ParticipantNameLabel from "./ParticipantNameLabel";
import ResponsesTable from "./ResponsesTable";
import SlotDetails from "./SlotDetails";
import SlotVote from "./SlotVote";

export default function FullResponseTable({ maxSlotsPerPage, variant }) {
  const { test, pollData, setPollId, userResponses, setUserResponses, participant } = useVote();
  console.log(pollData);
  const isOverview = variant == "overview";
  const [slotPage, setSlotPage] = useState(1);
  const { slots, participants }: { slots: FsSlot[]; participants: ParticipantFullInfo[] } = pollData;
  const maxPage = Math.ceil(slots.length / maxSlotsPerPage);
  const displayedSlotsIds = slots
    .filter((s, index) => index + 1 > (slotPage - 1) * maxSlotsPerPage && index + 1 <= slotPage * maxSlotsPerPage)
    .map((s) => s.id);
  return (
    <div className="mb-[68px] lg:mb-0 lg:pl-8 ">
      <PaginationRow
        left={{
          onClick: () => {
            setSlotPage((p) => {
              if (p > 1) return p - 1;
              return p;
            });
          },
          disabled: slotPage === 1,
        }}
        right={{
          onClick: () => {
            setSlotPage((p) => {
              if (p < maxPage) return p + 1;
              return p;
            });
          },
          disabled: slotPage === maxPage,
        }}
        options={pollData.slots.length}
        showLegend={isOverview}
      />
      <div
        style={{
          gridTemplateColumns: `228px 490px`,
          gridTemplateRows: `auto auto 200px`, //repeat(${participants.length},48px),
          gridTemplateAreas: `
          'top-left${" slots".repeat(displayedSlotsIds.length)} '
          '.${" yes-count".repeat(displayedSlotsIds.length)}'
          '${" participants".repeat(displayedSlotsIds.length + 1)}'
          `,
          // placeItems: "center",
          // gap: "10px",
        }}
        className="flex flex-col lg:grid"
      >
        <div className="hidden h-full w-full flex-col justify-end lg:flex " style={{ gridArea: "top-left" }}>
          {isOverview ? (
            <div></div>
          ) : (
            <ParticipantNameLabel
              participant={{
                name: "You",
                email: "",
              }}
            />
          )}
        </div>
        <div
          style={{
            gridArea: "slots",
            display: "flex",

            // gap: "10px",
          }}
          className="mb-[66px] mt-4 flex-col border-t border-slate-300 lg:mb-0 lg:flex-row lg:border-t-0"
        >
          {slots
            .filter((s) => displayedSlotsIds.includes(s.id))
            .map((event) => {
              return isOverview ? (
                <SlotDetails key={event.id.toString()} event={event} />
              ) : (
                <SlotVote
                  key={event.id.toString()}
                  slot={event}
                  vote={userResponses.find((v) => v.id == event.id)?.response as string}
                  setVote={(vote) => {
                    setUserResponses(
                      userResponses.map((v) => {
                        if (v.id != event.id) return v;
                        return { id: v.id, response: vote };
                      })
                    );
                  }}
                />
              );
            })}
        </div>
        <ResponsesTable
          displayedSlotsIds={displayedSlotsIds}
          pollData={pollData}
          excludedParticipantEmail={isOverview ? "" : participant?.email}
          polePositionParticipantEmail={isOverview ? participant.email : ""}
        />
      </div>
    </div>
  );
}
