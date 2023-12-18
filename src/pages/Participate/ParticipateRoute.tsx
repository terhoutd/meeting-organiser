import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useVote } from "../../context/voteContext";
import { useEffect, useState } from "react";

export function ParticipateRoute() {
  const { groupPollId } = useParams();
  const { isVoting, participantIdFromCookie } = useVote();
  let params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const pollId = params.groupPollId || "";
  const basePath = `/meeting/participate/id/${groupPollId}`;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (currentPath === basePath && !participantIdFromCookie) {
      navigate(basePath + "/vote");
    } else if (currentPath == basePath + "/vote/confirm" && !isVoting) {
      navigate(basePath + "/vote");
    } else {
      setLoading(false);
    }
  }, [currentPath, basePath, participantIdFromCookie, navigate]);
  if (loading) return <span>loading</span>;
  else return <Outlet />;
}
