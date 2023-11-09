import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { NO_VOTE } from "../../others/Constants";

import Button from "../../components/Button";
import { useVote } from "../../context/voteContext";
import ResponseLegend from "../../components/ResponseLegend";
import ParticipationHeaders from "../../components/ParticipationHeader";
import PaginationWrapper from "../../components/PaginationWrapper";
import { VoteTable } from "../../components/VoteTable";

export default function ManageGroupPoll() {
  let params = useParams();
  const { pollData, setPollId, userResponses, setUserResponses, setParticipant, setPageType } = useVote();

  const navigate = useNavigate();
  const pollId = params.groupPollId || "";
  useEffect(() => {
    setPollId(pollId);
    setPageType("poll overview");
  }, []);

  const pollDataAvailable = !!pollData;
  const urlConfirmPage = `/meeting/organize/id/${pollId}/edit`;
  useEffect(() => {
    console.log("usef1", pollDataAvailable, userResponses, pollData);
    if (!pollDataAvailable) return;
    // // console.log("in", declineAllSlots(pollData));
    // declineAllSlots(pollData);
    const curParticipant = pollData.participants.find((p) => p.isOrganiser);
    setParticipant(curParticipant);
    setUserResponses(curParticipant.responses);
  }, [pollDataAvailable]);

  if (!pollData || !userResponses) return <span>no data yet</span>;

  const isAllDeclined = userResponses.every((r) => {
    return r.response === NO_VOTE;
  });

  const maxSlotsPerPage = 8;

  return (
    <div className="flex flex-col bg-white lg:flex-row">
      <div className=" relative w-full sm:px-0  lg:border lg:border-slate-300">
        <div className="flex  flex-col justify-between lg:mx-8 lg:mt-8 ">
          <div className="mx-4 mb-6 lg:mx-0">
            <ParticipationHeaders mainText={pollData.title} />
          </div>
          <div className="mx-4 mb-4  flex justify-between lg:mx-0">
            <ul>
              <li>You are the organizer</li>
            </ul>
            <div className=" flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  navigate("/meeting/organize/id/" + pollId + "/edit");
                }}
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${location.protocol}//${location.host}/meeting/participate/id/${pollId}/vote`
                  );
                }}
              >
                Copy link
              </Button>
            </div>
          </div>
          <div className=" mx-4  justify-between lg:mx-0 lg:flex">
            <p className="mb-6 font-semibold">Availabilities</p>
            <ResponseLegend column={false} extended={false} />
          </div>

          <div className=" mb-2 ">
            <PaginationWrapper
              slotList={pollData.slots}
              maxSlotsPerPage={maxSlotsPerPage}
              showLegend={false}
              showTip={false}
            >
              <VoteTable variant="organiser overview" />
            </PaginationWrapper>
          </div>
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
