import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useVote } from "../../context/VoteContext";
import { useEffect, useState } from "react";

export function ParticipateRoute() {
  const { isVoting, participantIdFromCookie, pollId } = useVote();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const basePath = `/meeting/participate/id/${pollId}`;
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
