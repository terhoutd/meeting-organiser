import React, { Children, PropsWithChildren } from "react";

type Button = {
  variant?: "primary" | "secondary";
  onClick: (e: any) => void;
  disabled?: boolean;
  children: string;
};
export default function Button({ variant, onClick, disabled, children }: Button) {
  let className;
  if (variant == "secondary") {
    className =
      "h-11 border border-slate-300 bg-white px-4 font-medium text-gray-600 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-500";
  } else {
    className =
      "h-11 bg-blue-600 px-4 font-medium text-white hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-500";
  }
  return (
    <button onClick={onClick} disabled={disabled} className={"h-11  px-4 font-medium " + className}>
      {children}
    </button>
  );
}
