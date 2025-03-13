import { Link } from "react-router-dom";
import styles from "../styles/ClubCardWithClubs.module.css";

const ClubCardWithClubs = ({ club }) => {
  return (
    <div className={styles.clubCard}>
      {/* Club Image */}
      <div className={styles.clubImageContainer}>
        <img
          src={club.image != null ? `data:image/jpeg;base64,${club.image}` : "/placeholder-image.png"}
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
        <Link to={`/clubs/${club.clubId}`} className={styles.openClubButton}>
          Open Club
        </Link>
      </div>
    </div>
  );
};

export default ClubCardWithClubs;