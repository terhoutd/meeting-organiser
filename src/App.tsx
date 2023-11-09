import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import ManageGroupPoll from "./pages/Organize/ManageGroupPoll";
import VoteGroupPoll from "./pages/Participate/VoteGroupPoll";
import ConfirmVoteGroupPoll from "./pages/Participate/ConfirmVoteGroupPoll";
import OverviewVoteGroupPoll from "./pages/Participate/OverviewVoteGroupPoll";
import { VoteProvider } from "./context/voteContext";
import { CreateEditGroupPoll } from "./pages/Organize/CreateEditGroupPoll";

export default function App() {
  //return <CreateGroupPoll />;
  return (
    <Router>
      <VoteProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meeting/organize/groups" element={<CreateEditGroupPoll variant="create" />} />
          <Route path="/meeting/organize/id/:groupPollId" element={<ManageGroupPoll />} />
          <Route path="/meeting/organize/id/:groupPollId/edit" element={<CreateEditGroupPoll variant="edit" />} />
          <Route path="/meeting/participate/id/:groupPollId/vote" element={<VoteGroupPoll />} />
          <Route path="/meeting/participate/id/:groupPollId/vote/confirm" element={<ConfirmVoteGroupPoll />} />
          <Route path="/meeting/participate/id/:groupPollId" element={<OverviewVoteGroupPoll />} />
        </Routes>
      </VoteProvider>
    </Router>
  );
}
