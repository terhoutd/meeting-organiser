import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { NO_VOTE } from "../../others/Constants";

import Button from "../../components/Button";
import { useVote } from "../../context/voteContext";
import MeetingOverview from "../../components/MeetingOverview";
import ResponseLegend from "../../components/ResponseLegend";
import ParticipationHeaders from "../../components/ParticipationHeader";
import PaginationWrapper from "../../components/PaginationWrapper";
import { VoteTable } from "../../components/VoteTable";

export default function VoteGroupPoll() {
  let params = useParams();
  const { test, pollData, setPollId, userResponses, setUserResponses, participant } = useVote();
  console.log(test);
  console.log("VoteGroupPoll rendering");
  console.log("pollData", pollData);

  console.log("responses", userResponses);
  const navigate = useNavigate();
  const pollId = params.groupPollId || "";
  useEffect(() => setPollId(pollId), []);

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

  const isAllDeclined = userResponses.every((r) => {
    return r.response === NO_VOTE;
  });

  const maxSlotsPerPage = 5;

  return (
    <div className="flex  h-[700px] flex-col bg-white lg:flex-row">
      <div className={" w-full border-b lg:w-[250px] lg:border lg:border-r-0 lg:border-slate-300 lg:p-8 "}>
        <MeetingOverview />
      </div>
      <div className=" relative w-full sm:px-0 lg:w-[750px] lg:border lg:border-slate-300">
        <div className="flex  flex-col	 justify-between lg:px-8 lg:pt-8">
          <div className="mx-4">
            <ParticipationHeaders
              mainText="Select your preferred times"
              subText="We’ll let you know when the organizer picks the best time"
            />
          </div>
          <div className=" mx-4 lg:hidden ">
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
        <div className="z-999 fixed left-0 bottom-0 flex w-full items-center justify-between border-t  border-slate-300 bg-white py-3 px-4 shadow-[0_-5px_18px_rgb(161_167_171_/_50%)] lg:absolute lg:py-4 lg:shadow-none ">
          <Button onClick={declineHandler} variant="secondary">
            Decline
          </Button>
          <span className="hidden lg:inline-block">Selecting more times makes it easier to find the best option</span>
          <Button onClick={continueHandler} disabled={isAllDeclined}>
            Continue
          </Button>
        </div>
      </div>
    </div>
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
    navigate(urlConfirmPage);
  }
  function continueHandler(e) {
    navigate(urlConfirmPage);
  }
}
