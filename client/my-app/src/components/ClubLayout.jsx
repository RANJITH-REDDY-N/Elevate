import { Outlet, Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import styles from "../styles/ClubLayout.module.css";

const ClubLayout = () => {
  const userClubs = useSelector((state) => state.user.userJoinedClubs);
  const { clubId } = useParams();

  // ✅ If no clubs, redirect to dashboard
  if (!userClubs || userClubs.length === 0) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Select the current club, fallback to the first club
  const selectedClub = userClubs.find((club) => club.clubId.toString() === clubId) || userClubs[0];

  // ✅ Redirect to first club details if no specific club is selected
  if (!clubId) {
    return <Navigate to={`/my-clubs/${selectedClub.clubId}/details`} replace />;
  }

  return (
    <div className={styles.clubLayout}>
      {/* ✅ Sidebar (Always Visible) */}
      <Sidebar />

      <div className={styles.mainContent}>
        {/* ✅ Club Banner (Remains the Same) */}
        <div className={styles.clubBanner}>
          <img src={selectedClub.clubBackgroundImageUrl || "/default-banner.jpg"} alt={selectedClub.clubName} />
          <h2 className={styles.clubTitle}>{selectedClub.clubName}</h2>
        </div>

        {/* ✅ Navigation Tabs */}
        <div className={styles.navTabs}>
          <button onClick={() => navigate(`/my-clubs/${selectedClub.clubId}/details`)}>Details</button>
          <button onClick={() => navigate(`/my-clubs/${selectedClub.clubId}/announcements`)}>Announcements</button>
          <button onClick={() => navigate(`/my-clubs/${selectedClub.clubId}/events`)}>Events</button>
          <button onClick={() => navigate(`/my-clubs/${selectedClub.clubId}/discussions`)}>Discussions</button>
        </div>

        {/* ✅ Content Changes Below While Keeping the Banner */}
        <Outlet />
      </div>
    </div>
  );
};

export default ClubLayout;