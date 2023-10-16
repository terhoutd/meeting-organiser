import moment from "moment";
import React from "react";
import { IFNEEDBE_VOTE, YES_VOTE } from "../others/Constants";
import { FsSlot, responseOption, TimesResponse } from "../others/Types";
import TickBox from "./TickBox";
import { getDateDetails } from "../others/helpers";

export default function SlotDetails({
  event,
  response,
  variant,
  mobileSimple,
}: {
  event: FsSlot;
  response?: responseOption;
  variant?: string;
  mobileSimple?: boolean;
}) {
  const startDate = event.start.toDate();
  const endDate = event.end.toDate();
  const dateDetails = getDateDetails(startDate, endDate);

  return (
    <div>
      <div className={mobileSimple ? "hidden lg:block" : ""}>
        <div className={`pointer-events-none relative mr-auto flex w-[90px] py-0.5 lg:flex-col	`}>
          <div className="mr-5 flex flex-col lg:mr-0">
            <div className={`mx-auto  uppercase text-gray-600`}>{dateDetails.day}</div>
            <div className="mx-auto text-4xl font-bold uppercase">{dateDetails.date}</div>
            <div className="mx-auto uppercase text-gray-500">{dateDetails.month}</div>
          </div>
          <div className="flex shrink-0 flex-col justify-center">
            <div className="mx-auto font-medium uppercase">{dateDetails.startTime}</div>
            <div className=" mx-auto font-medium uppercase">{dateDetails.endTime}</div>fdfs
          </div>
        </div>
      </div>
      {mobileSimple && (
        <div className="font-medium lg:hidden">
          {dateDetails.day} {dateDetails.date} {dateDetails.month} {dateDetails.startTime} - {dateDetails.endTime} bla
        </div>
      )}
    </div>
  );
}
