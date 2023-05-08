import React from "react";
import { useVote } from "../context/voteContext";
import EventMetaData from "./EventMetaData";
import ResponseLegend from "./ResponseLegend";
import TickBox from "./TickBox";

export default function MeetingOverview() {
  return (
    <div>
      <EventMetaData />
      <div className="hidden lg:block">
        <ResponseLegend column={true} extended={true} />
      </div>
    </div>
  );
}
