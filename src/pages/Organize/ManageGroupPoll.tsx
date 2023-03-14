import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../others/firebase";
import SlotDetails from "../../components/SlotDetails";
import { getPollData } from "../../others/helpers";
import usePollData from "../../hooks/usePollData";
import TickBox from "../../components/TickBox";

export default function ManageGroupPoll() {
  let params = useParams();
  const pollId = params.groupPollId;
  if (!pollId) return;

  const pollData = usePollData(pollId);
  console.log(pollData);

  return pollData?.slots ? (
    <div>
      ManageGroupPoll {pollId}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `226px repeat(${pollData.slots.length}, 90px [col-start])`,
          gridTemplateRows: "1fr 48px",
          placeItems: "center",
          gap: "10px 10px",
        }}
      >
        <div></div>
        {pollData.slots.map((event) => {
          return <SlotDetails key={event.id} event={event} />;
        })}
        <div className="justify-self-start">eddy</div>

        <TickBox type="yes" variant="table" />
        <TickBox type="yes" variant="table" />
        <TickBox type="no" variant="table" />
      </div>
    </div>
  ) : (
    <span>"no data yet"</span>
  );
}
