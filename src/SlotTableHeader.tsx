import moment from "moment";
import React from "react";
import { FsCalEvent } from "./Types";

export default function SlotTableHeader({ event }: { event: FsCalEvent }) {
  const startDate = event.start.toDate();
  const endDate = event.end.toDate();
  return (
    <div className="w-24 flex flex-col mt-2">
      <div className="uppercase text-gray-600 font-bold text-sm mx-auto">{moment(startDate).format("ddd")}</div>
      <div className="text-3xl uppercase mx-auto">{startDate.getDate()}</div>
      <div className="text-gray-500 uppercase text-sm font-semibold mx-auto">{moment(startDate).format("MMM")}</div>
      <div className="mx-auto font-semibold text-sm">{moment(startDate).format("h:mm a")}</div>
      <div className="mx-auto font-semibold text-sm">{moment(endDate).format("h:mm a")}</div>
    </div>
  );
}
