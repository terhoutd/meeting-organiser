import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function ConfirmVoteGroupPoll() {
  function voteHandler(e) {
    e.preventDefault();

    setParticipantInfo(pollId, { name: name, email: email, responses: userResponses });
  }
  const navigate = useNavigate();
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
      </form>
    </>
  );
  function backHandler() {
    navigate(`/meeting/participate/id/${pollId}/vote/confirm`);
  }
}
