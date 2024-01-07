import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import ManageGroupPoll from "./pages/Organize/ManageGroupPoll";
import VoteGroupPoll from "./pages/Participate/VoteGroupPoll";
import ConfirmVoteGroupPoll from "./pages/Participate/ConfirmVoteGroupPoll";
import OverviewVoteGroupPoll from "./pages/Participate/OverviewVoteGroupPoll";
import { VoteProvider } from "./context/VoteContext";
import { CreateEditGroupPoll } from "./pages/Organize/CreateEditGroupPoll";
import { ParticipateRoute } from "./pages/Participate/ParticipateRoute";
import LoginPage from "./pages/Auth/Login";

export default function App() {
  //return <CreateGroupPoll />;
  return (
    <Router>
      <VoteProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meeting/auth" element={<LoginPage />} />
          <Route
            path="/meeting/organize/groups"
            element={<CreateEditGroupPoll variant="create" />}
          />
          <Route path="/meeting/organize/id/:groupPollId" element={<ManageGroupPoll />} />
          <Route
            path="/meeting/organize/id/:groupPollId/edit"
            element={<CreateEditGroupPoll variant="edit" />}
          />
          <Route path="/meeting/participate/id/:groupPollId" element={<ParticipateRoute />}>
            <Route path="vote" element={<VoteGroupPoll />} />
            <Route path="vote/confirm" element={<ConfirmVoteGroupPoll />} />
            <Route index element={<OverviewVoteGroupPoll />} />
          </Route>
        </Routes>
      </VoteProvider>
    </Router>
  );
}
