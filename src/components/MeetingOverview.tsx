import React from "react";
import { useVote } from "../context/VoteContext";
import EventMetaData from "./EventMetaData";
import ResponseLegend from "./ResponseLegend";
import TickBox from "./TickBox";

export default function MeetingOverview({ variant }: { variant?: string }) {
  return (
    <div>
      <EventMetaData />
      <div className={`hidden lg:block ${variant == "vote confirm" ? "lg:hidden" : ""}`}>
        <ResponseLegend column={true} extended={true} />
      </div>
    </div>
  );
}
