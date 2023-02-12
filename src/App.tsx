import React from "react";
import CreateGroupPoll from "./CreateGroupPoll";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ManageGroupPoll from "./ManageGroupPoll";
import VoteGroupPoll from "./VoteGroupPoll";

export default function App() {
  //return <CreateGroupPoll />;
  return (
    <Router>
      <Routes>
        <Route path="/organize/group" element={<CreateGroupPoll />} />
        <Route path="/organize/group/id/:groupPollId" element={<ManageGroupPoll />} />
        <Route path="/participate/group/id/:groupPollId" element={<VoteGroupPoll />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
