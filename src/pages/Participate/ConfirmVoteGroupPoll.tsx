import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import SlotDetails from "../../components/SlotDetails";
import SlotVote from "../../components/SlotVote";
import { UseVote } from "../../context/voteContext";
import usePollData from "../../hooks/usePollData";

export default function ConfirmVoteGroupPoll() {
  function voteHandler(e) {
    e.preventDefault();

    setParticipantInfo(pollId, { name: name, email: email, responses: userResponses });
  }
  let params = useParams();
  const { test } = UseVote();
  console.log(test);
  const pollId = params.groupPollId || "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const pollData = usePollData({
    pollId: pollId,
  });
  if (!pollData) return <span>no data yet</span>;

  return (
    <>
      <div>Let’s confirm your selection</div>
      <div>You’re submitting the following times</div>
      <form onSubmit={voteHandler}>
        <div>
          <label htmlFor="name">Your name</label>
          <input
            required
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="m-2 border-2"
          />
        </div>
        <div>
          <label htmlFor="email">Your email</label>
          <input
            required
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="m-2 border-2"
          />
        </div>
        <Button onClick={backHandler}>Back</Button>
        <Button onClick={voteHandler}>Submit response</Button>
        <div
          className="flex flex-row
        "
        >
          {pollData.slots.map((s) => {
            return <SlotDetails key={s.id.toString()} event={s} />;
          })}
        </div>
      </form>
    </>
  );
  function backHandler() {
    navigate(`/meeting/participate/id/${pollId}/vote/`);
  }
}
