import NoTickSvg from "../assets/noTickSvg";
import clsx from "clsx";
export default function TickBoxNo() {
  return (
    <div className={clsx("flex h-full w-full items-center justify-center bg-gray-50")}>
      <NoTickSvg className="w-7 text-slate-400" />
    </div>
  );
}
