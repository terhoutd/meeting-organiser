import { Navigate as navigate } from "react-big-calendar";
import { ToolbarArrows } from "./ToolbarArrows";

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
}: ToolBar) {
  return (
    <>
      <div className="space-x-2">
        <ToolbarArrows onClickHandler={() => onNavigate(navigate.PREVIOUS)} ariaLabel={messages.previous} />
        <ToolbarArrows onClickHandler={() => onNavigate(navigate.NEXT)} ariaLabel={messages.next} rotation={"right"} />

        <button
          type="button"
          onClick={() => onNavigate(navigate.TODAY)}
          aria-label={messages.today}
          className="border-2 h-12 px-6"
        >
          Today
        </button>
        <span className="rbc-toolbar-label">{label}</span>
      </div>
    </>
  );
}
