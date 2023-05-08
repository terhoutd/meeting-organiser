import React from "react";
import SlotDetails from "./SlotDetails";
import { responseOption } from "../others/Types";
import TickBox from "./TickBox";

export default function SelectedSlot({ event, response }: { event: any; response: responseOption }) {
  return (
    <div className={` relative flex lg:border lg:py-4`}>
      <div className=" top-0 left-0 mr-4 h-6 w-6 lg:absolute lg:mr-0">
        <TickBox type={response} variant="slot-details" />
      </div>

      <SlotDetails event={event} response={response} mobileSimple={true} />
    </div>
  );
}
