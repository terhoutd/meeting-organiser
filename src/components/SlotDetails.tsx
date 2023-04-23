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
    <div
      className={`relative mr-auto flex py-0.5 lg:mr-0 lg:w-[90px] lg:flex-col ${response ? "lg:border lg:py-4" : ""}`}
    >
      <div className=" flex lg:flex-col lg:items-center">
        {response && (
          <div className="top-0 left-0 mr-4 h-6 w-6 lg:absolute lg:mr-0">
            <TickBox type={response} variant="slot-details" />
          </div>
        )}
        <div
          className={`${
            variant == "organize" ? "" : "font-medium"
          }  mr-1  text-base leading-[23px] lg:mx-auto lg:text-sm lg:uppercase lg:text-gray-600`}
        >
          {moment(startDate).format("ddd")}
        </div>
        <div className="mr-1 text-base font-medium lg:mx-auto lg:text-3xl lg:font-bold lg:uppercase">
          {startDate.getDate()}
        </div>
        <div className="mr-1 text-base font-medium leading-[23px] lg:mx-auto lg:text-sm lg:font-semibold lg:uppercase  lg:text-gray-500  ">
          {moment(startDate).format("MMM")}
        </div>
      </div>
      <div className="flex shrink-0 justify-center lg:ml-5 lg:ml-0 lg:flex-col">
        <div className="mr-1 text-base font-medium uppercase lg:mx-auto">{moment(startDate).format("h:mm a")}</div>
        <div className="mr-1 text-base lg:hidden">-</div>
        <div className="text-md mr-1 text-base font-medium uppercase lg:mx-auto">
          {moment(endDate).format("h:mm a")}
        </div>
      </div>
    </div>
  );
}
