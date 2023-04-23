import React, { useState } from "react";
import { useVote } from "../context/voteContext";
import { FsSlot, ParticipantFullInfo } from "../others/Types";
import PaginationRow from "./PaginationRow";

export const PaginationContext = React.createContext({});

export default function PaginationWrapper({ children, maxSlotsPerPage, variant, slotList }) {
  const { pollData, isDesktop } = useVote();
  if (!pollData) return null;
  const { participants }: { slots: FsSlot[]; participants: ParticipantFullInfo[] } = pollData;
  const isOverview = variant == "overview";
  console.log("isOverview in PaginationWrapper", isOverview);
  console.log("isDesktop", isDesktop);
  console.log("slotList", slotList);
  const [rightPagination, setRightPagination] = useState(true);
  const [slotPage, setSlotPage] = useState(1);
  const maxPage = Math.ceil(slotList.length / maxSlotsPerPage);
  const slotsShownOnDesktop = slotList
    .filter((s, index) => index + 1 > (slotPage - 1) * maxSlotsPerPage && index + 1 <= slotPage * maxSlotsPerPage)
    .map((s) => s.id);
  const slotsShownOnMobile = slotList.map((s) => s.id);
  const slotsShown = isDesktop ? slotsShownOnDesktop : slotsShownOnMobile;

  const leftPaginationConfig = {
    onClick: () => {
      setSlotPage((p) => {
        if (p > 1) return p - 1;
        return p;
      });
      setRightPagination(false);
    },
    disabled: slotPage === 1,
  };
  const rightPaginationConfig = {
    onClick: () => {
      setSlotPage((p) => {
        if (p < maxPage) return p + 1;
        return p;
      });
      setRightPagination(true);
    },
    disabled: slotPage === maxPage,
  };
  const contextValue = {
    slotPage,
    setSlotPage,
    maxPage,
    rightPagination,
    setRightPagination,
    slotsShown,
    isOverview,
  };
  console.log("contextValue", contextValue);
  return (
    <PaginationContext.Provider value={contextValue}>
      <PaginationRow
        left={leftPaginationConfig}
        right={rightPaginationConfig}
        options={pollData.slots.length}
        showLegend={isOverview}
      />

      {children}
    </PaginationContext.Provider>
  );
}
