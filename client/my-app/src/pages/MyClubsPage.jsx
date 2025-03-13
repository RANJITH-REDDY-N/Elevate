import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import styles from "../styles/MyClubsPage.module.css";

const MyClubsPage = () => {
  const userClubs = useSelector((state) => state.user.userJoinedClubs);
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [selectedClub, setSelectedClub] = useState(null);

  /** 🔹 Auto-select the first club when no club is selected */
  useEffect(() => {
    if (userClubs.length > 0) {
      const defaultClub = userClubs.find((club) => club.clubId.toString() === clubId) || userClubs[0];
      setSelectedClub(defaultClub);

      // ✅ Redirect to first club's "Details" tab if no section is selected
      if (!clubId) {
        navigate(`/my-clubs/${defaultClub.clubId}/details`, { replace: true });
      }
    }
  }, [userClubs, clubId, navigate]);

  return (
    <div className={styles.container}>
      {/* ✅ 🔹 Top Club Selection Bar */}
      <div className={styles.clubSelectionBar}>
        {userClubs.map((club) => (
          <button
            key={club.clubId}
            className={`${styles.clubTab} ${selectedClub?.clubId === club.clubId ? styles.activeTab : ""}`}
            onClick={() => navigate(`/my-clubs/${club.clubId}/details`)}
          >
            {club.clubName}
          </button>
        ))}
      </div>

      {/* ✅ 🔹 Club Banner (Stays Constant) */}
      {selectedClub && (
        <div className={styles.clubBanner}>
          <img src={selectedClub.clubBackgroundImageUrl || "/default-banner.jpg"} alt={selectedClub.clubName} />
          <div className={styles.bannerText}>
            <h2 className={styles.clubTitle}>{selectedClub.clubName}</h2>
            <p className={styles.clubCreationDate}>Created at {selectedClub.createdAt}</p>
          </div>
        </div>
      )}

      {/* ✅ 🔹 Navigation Tabs */}
      <div className={styles.navTabs}>
        <button onClick={() => navigate(`/my-clubs/${selectedClub.clubId}/details`)}>Details</button>
        <button onClick={() => navigate(`/my-clubs/${selectedClub.clubId}/announcements`)}>Announcements</button>
        <button onClick={() => navigate(`/my-clubs/${selectedClub.clubId}/events`)}>Events</button>
        <button onClick={() => navigate(`/my-clubs/${selectedClub.clubId}/discussions`)}>Discussions</button>
      </div>

      {/* ✅ 🔹 This will render the correct component (Details, Announcements, etc.) */}
      <Outlet />
    </div>
  );
};

export default MyClubsPage;