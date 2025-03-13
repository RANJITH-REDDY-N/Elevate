import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "../styles/RequestsInDashboard.module.css";

const RequestsInDashboard = ({ userId }) => {
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  const [expanded, setExpanded] = useState(false);
  

  const handleWithdraw = (clubId) => {
    console.log(`Withdraw request for club ID: ${clubId}`);
    // API call logic to withdraw (not implemented yet)
  };

  const handleReapply = (clubId) => {
    console.log(`Reapply request for club ID: ${clubId}`);
    // API call logic to reapply (not implemented yet)
  };

  return (
    <div className={styles.requestsContainer}>
      <p className={styles.title}>Requests</p>
      <div className={styles.requestsGrid} style={{ maxHeight: expanded ? "none" : "200px" }}>
        {requests.map((request, index) => (
          <div key={index} className={styles.requestCard}>
            <h3>{request.clubName}</h3>
            <p className={styles.status}>{request.requestStatus}</p>
            {request.requestStatus === "PENDING" && <button className={styles.actionButton}>Withdraw</button>}
            {request.requestStatus === "REJECTED" && <button className={styles.actionButton}>Reapply</button>}
          </div>
        ))}
      </div>
      {!expanded && (
        <button className={styles.showMore} onClick={() => setExpanded(true)}>Show More</button>
      )}
    </div>
  );
};

export default RequestsInDashboard;