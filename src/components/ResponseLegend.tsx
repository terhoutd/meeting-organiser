import React from "react";
import TickBox from "./TickBox";

export default function ResponseLegend({ column, extended }: { column?: boolean; extended?: boolean }) {
  const variant = extended ? "legend-full" : "legend";
  return (
    <div className={`flex ${column ? "flex-col" : ""} gap-2`}>
      <TickBox type="yes thin" variant={variant} />
      <TickBox type="if need be" variant={variant} />
      <TickBox variant={variant} type="no thin" />
      <TickBox variant={variant} type="pending" />
    </div>
  );
}
