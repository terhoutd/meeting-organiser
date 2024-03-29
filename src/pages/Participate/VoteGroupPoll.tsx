import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { NO_VOTE } from "../../others/Constants";

import Button from "../../components/Button";
import { useVote } from "../../context/VoteContext";
import MeetingOverview from "../../components/MeetingOverview";
import ResponseLegend from "../../components/ResponseLegend";
import ParticipationHeaders from "../../components/ParticipationHeader";
import PaginationWrapper from "../../components/PaginationWrapper";
import { VoteTable } from "../../components/VoteTable";
import { VoteAndConfirmWrapper } from "../../components/VoteAndConfirmWrapper";

export default function VoteGroupPoll() {
  const {
    setIsVoting,
    pollData,
    userResponses,
    setUserResponses,
    participant,
    pageType,
    setPageType,
  } = useVote();
  console.log("VoteGroupPoll rendering");
  console.log("pollData", pollData);

  console.log("responses", userResponses);
  const navigate = useNavigate();
  useEffect(() => {
    setPageType("vote");
  }, []);

  const pollDataAvailable = !!pollData;
  const urlConfirmPage = `/meeting/participate/id/${pollId}/vote/confirm`;
  useEffect(() => {
    console.log("usef1", pollDataAvailable, userResponses, pollData);
    //by default, all slots are declined, unless we edit the votes or the pollData is not present yet
    if (userResponses || !pollDataAvailable) return;
    console.log("in", declineAllSlots(pollData));
    declineAllSlots(pollData);
  }, [pollDataAvailable]);

  if (!pollData || !userResponses) return <span>no data yet</span>;

  // const isAllDeclined = userResponses.every((r) => {
  //   return r.response === NO_VOTE;
  // });

  const maxSlotsPerPage = 5;

  return (
    <VoteAndConfirmWrapper>
      <>
        <div
          className={
            "  w-full border-b p-4 lg:w-[250px] lg:border lg:border-r-0 lg:border-slate-300 lg:p-8 lg:pb-4"
          }
        >
          <MeetingOverview />
        </div>
        <div className="relative w-full sm:px-0 lg:w-[750px] lg:border lg:border-slate-300">
          <div className="flex  flex-col lg:px-8 lg:pt-8">
            <div className="mx-4">
              <ParticipationHeaders
                mainText="Select your preferred times"
                subText="We’ll let you know when the organizer picks the best time"
              />
            </div>
            <div className=" mx-4 mb-2 lg:hidden ">
              <p className="mb-2 font-semibold">Availabilities</p>
              <ResponseLegend column={false} extended={false} />
            </div>

            <div className=" ">
              <PaginationWrapper
                slotList={pollData.slots}
                maxSlotsPerPage={maxSlotsPerPage}
                showLegend={false}
                showTip={false}
              >
                <VoteTable />
              </PaginationWrapper>
            </div>
          </div>
          <div className="z-999 fixed bottom-0 left-0 flex w-full items-center justify-between border-t  border-slate-300 bg-white px-4 py-3 shadow-[0_-5px_18px_rgb(161_167_171_/_50%)] lg:absolute lg:py-4 lg:shadow-none ">
            <Button onClick={declineHandler} variant="secondary">
              Decline
            </Button>
            <span className="hidden lg:inline-block">
              Selecting more times makes it easier to find the best option
            </span>
            <Button onClick={continueHandler}>Continue</Button>
          </div>
        </div>
      </>
    </VoteAndConfirmWrapper>
  );
  function declineAllSlots(pollData) {
    setUserResponses(
      pollData.slots.map((ev) => {
        return { id: ev.id, response: NO_VOTE };
      })
    );
  }
  function declineHandler() {
    declineAllSlots(pollData);
    setIsVoting(true);
    navigate(urlConfirmPage);
  }
  function continueHandler(e) {
    setIsVoting(true);
    navigate(urlConfirmPage);
  }
}
