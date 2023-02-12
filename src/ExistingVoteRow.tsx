import React from "react";
import IfNeedBeBox from "./assets/IfNeedBeBox";
import NoTickBox from "./assets/NoTickBox";
import QuestionTickBox from "./assets/QuestionTickBox";
import YesTickBox from "./assets/YesTickBox";
import { IFNEEDBE_VOTE, NO_VOTE, YES_VOTE } from "./Constants";
import { FsCalEvent } from "./Types";

export default function ExistingVoteRow({
  userName,
  userVotes,
  events,
}: {
  userName: string;
  userVotes: any;
  events: FsCalEvent[];
}) {
  return (
    <>
      <div className="justify-self-start">{userName}</div>
      {events.map((ev) => {
        const userVoteforEvent = userVotes.find((uv) => uv.id === ev.id)?.vote;
        if (userVoteforEvent == NO_VOTE) return <NoTickBox />;
        if (userVoteforEvent == YES_VOTE) return <YesTickBox />;
        if (userVoteforEvent == IFNEEDBE_VOTE) return <IfNeedBeBox />;
        return <QuestionTickBox />;
      })}
    </>
  );
}
