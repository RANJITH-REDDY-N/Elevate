import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styles from "../styles/ClubDetails.module.css";

const ClubDetails = () => {
  const { clubId } = useParams();
  const userClubs = useSelector((state) => state.user.userJoinedClubs);

  // Find the selected club by clubId
  const selectedClub = userClubs.find((club) => club.clubId.toString() === clubId);

  if (!selectedClub) {
    return <p className={styles.noClubMessage}>Club not found.</p>;
  }

  return (
    <div className={styles.clubDetailsContainer}>
      {/* 🔹 Navigation Tabs */}
      <div className={styles.navTabs}>
        <button className={styles.activeTab}>Details</button>
        <button>Announcements</button>
        <button>Events</button>
        <button>Discussions</button>
      </div>

      {/* 🔹 Club Description */}
      <div className={styles.clubDescription}>
        <p>🎉 {selectedClub.description || "No description available for this club."}</p>
        <p>
          We hold regular meetups where members can dive into friendly competitions,
          attend workshops led by <span className={styles.highlight}>expert players</span>,
          and enjoy casual games in a friendly environment. ✨
        </p>
        <p>
          Whether you want to enhance your strategy, meet new pals, or simply
          relish the beauty of chess, our club is the perfect mix of learning and
          enjoyment! ⭐
        </p>
      </div>

      {/* 🔹 Club Members Section */}
      <div className={styles.clubMembersContainer}>
        <h3 className={styles.clubMembersTitle}>Club Members <span>{selectedClub.members?.length}/50</span></h3>
        <div className={styles.clubMembersList}>
          {selectedClub.members?.map((member) => (
            <div key={member.id} className={styles.memberItem}>
              <div className={styles.memberAvatar}></div>
              <div className={styles.memberInfo}>
                <span className={styles.memberName}>{member.name}</span>
                <span className={styles.memberRole}>{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;