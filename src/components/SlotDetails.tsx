import moment from "moment";
import React from "react";
import { IFNEEDBE_VOTE, YES_VOTE } from "../others/Constants";
import { FsSlot, responseOption, TimesResponse } from "../others/Types";
import TickBox from "./TickBox";

export default function SlotDetails({
  event,
  response,
  variant,
}: {
  event: FsSlot;
  response?: responseOption;
  variant?: string;
}) {
  const startDate = event.start.toDate();
  const endDate = event.end.toDate();
  return (
    <div className={`relative mr-auto flex w-[90px] py-0.5 lg:flex-col ${response ? "border py-4" : ""}`}>
      <div className="mr-3 flex flex-col">
        {response && (
          <div className="absolute top-0 left-0 h-6 w-6">
            <TickBox type={response} variant="slot-details" />
          </div>
        )}
        <div className={`${variant == "organize" ? "" : "font-medium"}  mx-auto text-sm  uppercase text-gray-600`}>
          {moment(startDate).format("ddd")}
        </div>
        <div className="mx-auto text-3xl font-bold uppercase">{startDate.getDate()}</div>
        <div className="mx-auto text-sm font-semibold uppercase text-gray-500">{moment(startDate).format("MMM")}</div>
      </div>
      <div className="flex shrink-0 flex-col justify-center">
        <div className="mx-auto text-base font-medium uppercase">{moment(startDate).format("h:mm a")}</div>
        <div className="mx-auto text-base font-medium uppercase">{moment(endDate).format("h:mm a")}</div>
      </div>
    </div>
  );
}
