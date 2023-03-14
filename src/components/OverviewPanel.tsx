import React from "react";
import { useVote } from "../context/voteContext";
import EventMetaData from "./EventMetaData";
import ResponseLegend from "./ResponseLegend";
import TickBox from "./TickBox";

export default function OverviewPanel() {
  return (
    <div className={" w-full lg:w-[250px] lg:border lg:border-r-0 lg:border-slate-300 lg:p-8 "}>
      <EventMetaData />
      <div className="hidden lg:block">
        <ResponseLegend column={true} extended={true} />
      </div>
    </div>
  );
}
