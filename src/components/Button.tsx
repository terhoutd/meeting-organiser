import React, { Children, PropsWithChildren } from "react";

type Button = {
  variant?: "primary" | "secondary" | "link";
  onClick?: (e: any) => void;
  disabled?: boolean;
  children: string;
  className?: string;
};
export default function Button({ variant, onClick, disabled, children, className }: Button) {
  let variantClassName;
  if (variant == "secondary") {
    variantClassName =
      "h-11 border border-slate-300 bg-white px-4 font-medium text-gray-600 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-500";
  } else if (variant == "link") {
    variantClassName = "h-11 px-4 font-medium text-blue-600 hover:underline disabled:text-gray-500";
  } else {
    variantClassName =
      "h-11 bg-blue-600 px-4 font-medium text-white hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-500";
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={"min-h-[44px]  px-4 font-medium " + variantClassName + " " + className}
    >
      {children}
    </button>
  );
}
