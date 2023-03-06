import moment from "moment";
import React from "react";
import { IFNEEDBE_VOTE, YES_VOTE } from "../others/Constants";
import { FsSlot, responseOption, TimesResponse } from "../others/Types";
import TickboxIfneedbe from "./TickboxIfneedbe";
import TickBoxYes from "./TickBoxYes";

export default function SlotDetails({
  event,
  response,
  variant,
}: {
  event: FsSlot;
  response?: responseOption;
  variant: string;
}) {
  const startDate = event.start.toDate();
  const endDate = event.end.toDate();
  return (
    <div className={`relative mt-3 flex w-[90px] flex-col ${response ? "border py-4" : "pb-2"}`}>
      {response && (
        <div className="absolute top-0 left-0 h-6 w-6">
          {response == YES_VOTE ? <TickBoxYes variant="slot-details" /> : <TickboxIfneedbe variant="slot-details" />}
        </div>
      )}
      <div className={`${variant == "organize" ? "" : "font-medium"} mx-auto text-sm  uppercase text-gray-600`}>
        {moment(startDate).format("ddd")}
      </div>
      <div className="mx-auto my-1 text-3xl font-bold uppercase">{startDate.getDate()}</div>
      <div className="mx-auto my-1 text-sm font-semibold uppercase text-gray-500">
        {moment(startDate).format("MMM")}
      </div>
      <div className="mx-auto text-base font-medium uppercase">{moment(startDate).format("h:mm a")}</div>
      <div className="mx-auto text-base font-medium uppercase">{moment(endDate).format("h:mm a")}</div>
    </div>
  );
}
