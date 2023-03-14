import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { NO_VOTE } from "../../others/Constants";

import Button from "../../components/Button";
import { useVote } from "../../context/voteContext";
import FullResponseTable from "../../components/FullResponseTable";
import OverviewPanel from "../../components/OverviewPanel";
import ResponseLegend from "../../components/ResponseLegend";

export default function VoteGroupPoll() {
  let params = useParams();
  const { test, pollData, setPollId, userResponses, setUserResponses, participant } = useVote();
  console.log(test);
  console.log("VoteGroupPoll rendering");
  console.log("responses", userResponses);
  const navigate = useNavigate();
  const pollId = params.groupPollId || "";
  useEffect(() => setPollId(pollId));

  const pollDataAvailable = !!pollData;
  const urlConfirmPage = `/meeting/participate/id/${pollId}/vote/confirm`;
  useEffect(() => {
    console.log("usef1", pollDataAvailable, userResponses, pollData);
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
    <div className="flex h-full flex-col lg:flex-row">
      <OverviewPanel />

      <div className="flex w-[100vw] flex-col	 justify-between sm:px-0 lg:w-[750px] lg:border lg:border-slate-300">
        <div className="mb-8 border-t border-slate-300 px-4  pt-4 lg:mb-0 lg:border-0 lg:pl-8">
          <h1 className=" mb-2 text-lg font-medium lg:text-2xl lg:font-normal" data-testid="instructions-main-title">
            Select your preferred times
          </h1>
          <p className="">We’ll let you know when the organizer picks the best time</p>
        </div>

        <div className=" mx-4 lg:hidden ">
          <p className="mb-2 font-semibold">Availabilities</p>
          <ResponseLegend column={false} extended={false} />
        </div>

        <FullResponseTable maxSlotsPerPage={maxSlotsPerPage} />
        <div className="z-999 fixed left-0 bottom-0 flex w-full items-center justify-between border-t border-slate-300  bg-white py-3 px-4 shadow-[0_-5px_18px_rgb(161_167_171_/_50%)] lg:static lg:py-4 lg:shadow-none ">
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
