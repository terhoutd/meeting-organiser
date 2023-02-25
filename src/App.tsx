import React from "react";
import CreateGroupPoll from "./pages/Organize/CreateGroupPoll";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import ManageGroupPoll from "./pages/Organize/ManageGroupPoll";
import VoteGroupPoll from "./pages/Participate/VoteGroupPoll";
import EditGroupPoll from "./pages/Organize/EditGroupPoll";
import ConfirmVoteGroupPoll from "./pages/Participate/ConfirmVoteGroupPoll";
import OverviewVoteGroupPoll from "./pages/Participate/OverviewVoteGroupPoll";
import { VoteProvider } from "./context/voteContext";

export default function App() {
  //return <CreateGroupPoll />;
  return (
    <Router>
      <VoteProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meeting/organize/groups" element={<CreateGroupPoll />} />
          <Route path="/meeting/organize/id/:groupPollId" element={<ManageGroupPoll />} />
          <Route path="/meeting/organize/id/:groupPollId/edit" element={<EditGroupPoll />} />
          <Route path="/meeting/participate/id/:groupPollId/vote" element={<VoteGroupPoll />} />
          <Route path="/meeting/participate/id/:groupPollId/vote/confirm" element={<ConfirmVoteGroupPoll />} />
          <Route path="/meeting/participate/id/:groupPollId" element={<OverviewVoteGroupPoll />} />
        </Routes>
      </VoteProvider>
    </Router>
  );
}
