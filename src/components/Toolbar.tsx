import { ToolbarProps, Navigate as navigate } from "react-big-calendar";
import { ToolbarArrows } from "./ToolbarArrows";
import { getDateDetails } from "../others/helpers";
import { ComponentProps, ComponentType, ReactElement } from "react";

type ToolBar = {
  label: string;
  localizer: {
    messages: {
      next: string;
      previous: string;
      today: string;
    };
  };
  onNavigate: (arg1: string) => {};
};
export default function CustomToolbar({
  // date, // available, but not used here
  label,
  localizer: { messages },
  onNavigate,
}: ToolbarProps): ReactElement {
  return (
    <div className="mb-8">
      <div className="space-x-2">
        <ToolbarArrows
          onClickHandler={() => onNavigate(navigate.PREVIOUS)}
          ariaLabel={messages.previous}
        />
        <ToolbarArrows
          onClickHandler={() => onNavigate(navigate.NEXT)}
          ariaLabel={messages.next}
          rotation={"right"}
        />

        <button
          type="button"
          onClick={() => onNavigate(navigate.TODAY)}
          aria-label={messages.today}
          className="h-12 border-2 px-6"
        >
          Today
        </button>
        <span className="rbc-toolbar-label">{label}</span>
      </div>
    </div>
  );
}

export function CalendarWeekHeader(props) {
  // console.log(props);
  // debugger;
  const { date } = props;
  const dateDetails = getDateDetails(date, date); //putting same date twice to gain time and keep function as is
  return (
    <div className="flex h-[50px] flex-col ">
      <span className="block text-sm uppercase">{dateDetails.day}</span>
      <span className=" block text-[30px]">{dateDetails.date}</span>
    </div>
  );
}
