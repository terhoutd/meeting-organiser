import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import FullResponseTable from "../../components/FullResponseTable";
import { useVote } from "../../context/voteContext";

export default function OverviewVoteGroupPoll() {
  let params = useParams();
  const pollId = params.groupPollId || "";
  const { pollData, setPollId, userResponses, participant, setParticipant } = useVote();
  const navigate = useNavigate();
  console.log(userResponses);
  if (!pollData || !userResponses) return <span>no data yet</span>;

  return (
    <>
      <div>OverviewVoteGroupPoll</div>
      <FullResponseTable maxSlotsPerPage={8} variant="overview" />
      <div className="mt-7 flex gap-6">
        <Button onClick={changeResponseHandler} variant="secondary">
          Change responses
        </Button>
      </div>
    </>
  );
  function changeResponseHandler() {
    navigate(`/meeting/participate/id/${pollId}/vote/`);
  }
}
