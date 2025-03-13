import { useState } from "react";
import { requestToJoinClub } from "../services/api";
import styles from "../styles/ClubCard.module.css";

const ClubCard = ({ club }) => {
  const [requestSent, setRequestSent] = useState(false);

  const handleJoinRequest = async () => {
    setRequestSent(true); // Update UI immediately
    try {
      await requestToJoinClub(club.clubName);
    } catch (error) {
      console.error("Failed to send request:", error);
      setRequestSent(false); // Revert if API fails
    }
  };

  return (
    <div className={styles.clubCard}>
      {/* Club Image */}
      <div className={styles.clubImageContainer}>
        <img
          src={club.imageUrl || "/placeholder-image.png"}
          alt={club.clubName}
          className={styles.clubImage}
        />
      </div>
      
      {/* Club Details */}
      <div className={styles.clubDetails}>
        <div className={styles.clubHeader}>
          <h3 className={styles.clubName}>{club.clubName}</h3>
          <p className={styles.clubMembers}>{club.noOfMembers} Members</p>
        </div>
        <p className={styles.clubDescription}>{club.description}</p>
        <div className={styles.joinButtonContainer}>
          <button
            className={`${styles.joinButton} ${requestSent ? styles.active : styles.inactive}`}
            onClick={handleJoinRequest}
            disabled={requestSent}
          >
            {requestSent ? "Request Sent ✔" : "Request to Join"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;