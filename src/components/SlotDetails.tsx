import moment from "moment";
import React from "react";
import { FsSlot } from "../others/Types";

export default function SlotDetails({ event }: { event: FsSlot }) {
  const startDate = event.start.toDate();
  const endDate = event.end.toDate();
  return (
    <div className="mt-2 flex w-24 flex-col">
      <div className="mx-auto text-sm font-bold uppercase text-gray-600">{moment(startDate).format("ddd")}</div>
      <div className="mx-auto text-3xl uppercase">{startDate.getDate()}</div>
      <div className="mx-auto text-sm font-semibold uppercase text-gray-500">{moment(startDate).format("MMM")}</div>
      <div className="mx-auto text-sm font-semibold">{moment(startDate).format("h:mm a")}</div>
      <div className="mx-auto text-sm font-semibold">{moment(endDate).format("h:mm a")}</div>
    </div>
  );
}
