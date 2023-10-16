import { useContext } from "react";
import { useVote } from "../context/voteContext";
import { PaginationContext } from "./PaginationWrapper";
import { AnimatePresence } from "framer-motion";
import { MotionDiv } from "./MotionDiv";
import ParticipantNameLabel from "./ParticipantNameLabel";
import ResponsesTable from "./ResponsesTable";
import SlotDetails from "./SlotDetails";
import SlotVote from "./SlotVote";

export function VoteTable({ readOnly = false, countIcon }: { readOnly?: boolean; countIcon?: "people" | "tick" }) {
  const { test, pollData, setPollId, userResponses, setUserResponses, participant, isDesktop } = useVote();
  console.log("isDesktop", isDesktop);
  console.log(pollData);
  const { slotsShown } = useContext(PaginationContext);
  if (!slotsShown) return <span>no data yet</span>;
  return (
    <div
      style={{
        gridTemplateColumns: `228px 490px`,
        gridTemplateRows: `auto auto auto`,
        gridTemplateAreas: `
'top-left${" slots".repeat(slotsShown.length)} '
'.${" yes-count".repeat(slotsShown.length)}'
'${" participants".repeat(slotsShown.length + 1)}'
`,
      }}
      className="flex flex-col lg:grid "
    >
      <div className="hidden h-full w-full flex-col justify-end lg:flex " style={{ gridArea: "top-left" }}>
        {readOnly ? (
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
        style={{ gridArea: "slots" }}
        className=" mb-[66px] mt-4 flex flex-col border-t border-slate-300 lg:mb-0 lg:flex-row lg:border-t-0"
      >
        <AnimatePresence initial={false} mode={"wait"}>
          {pollData.slots
            .filter((s) => slotsShown.includes(s.id))
            .map((event) => {
              return (
                <MotionDiv key={event.id}>
                  {/* {readOnly ? (
                    <SlotDetails key={event.id.toString()} event={event} />
                  ) : ( */}
                  <SlotVote
                    variant="read"
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
                  {/* )} */}
                </MotionDiv>
              );
            })}
        </AnimatePresence>
      </div>
      <ResponsesTable
        displayedSlotsIds={slotsShown}
        pollData={pollData}
        variant={readOnly ? "overview" : "vote"}
        currentParticipantPosition={readOnly ? "top" : "exclude"}
        countIcon={countIcon}
      />
    </div>
  );
}
