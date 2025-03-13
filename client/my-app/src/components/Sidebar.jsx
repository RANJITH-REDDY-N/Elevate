import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Sidebar.module.css";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { MdDashboard, MdExplore } from "react-icons/md";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { HiOutlineSpeakerphone, HiOutlineClipboardList } from "react-icons/hi";
import { BsCalendarEvent } from "react-icons/bs";
import { GoCommentDiscussion } from "react-icons/go";
import { TbProgressBolt } from "react-icons/tb";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userClubs = useSelector((state) => state.user.userJoinedClubs);
  const [expandedClubs, setExpandedClubs] = useState({});

  /** 🔹 Auto-expand the first club on mount */
  useEffect(() => {
    if (userClubs.length > 0) {
      const firstClub = userClubs[0].clubId;
      setExpandedClubs({ [firstClub]: true });

      // 🔹 Redirect to the first club's "Details" page if on /my-clubs
      if (location.pathname === "/my-clubs") {
        navigate(`/clubs/${firstClub}/details`);
      }
    }
  }, [userClubs, location.pathname, navigate]);

  /** 🔹 Sync expanded state with the current route */
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (pathParts[1] === "clubs" && pathParts.length > 2) {
      const clubId = pathParts[2];
      setExpandedClubs((prev) => ({
        ...prev,
        [clubId]: true,
      }));
    }
  }, [location.pathname]);

  /** 🔹 Handles expanding/collapsing club menus */
  const toggleClubMenu = (clubId) => {
    setExpandedClubs((prev) => ({
      ...prev,
      [clubId]: !prev[clubId],
    }));
  };

  /** 🔹 Handles logout */
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  };

  return (
    <div className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.logo}>Elevate</h2>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <Link to="/dashboard" className={location.pathname === "/dashboard" ? styles.active : ""}>
          <span className={styles.icon}><MdDashboard /></span> Dashboard
        </Link>
        <Link to="/explore" className={location.pathname === "/explore" ? styles.active : ""}>
          <span className={styles.icon}><MdExplore /></span> Explore
        </Link>
        <Link to="/requests" className={location.pathname === "/requests" ? styles.active : ""}>
          <span className={styles.icon}><TbProgressBolt /></span> Requests
        </Link>
      </nav>

      <div className={styles.divider} />

      {/* My Clubs Section */}
      <div className={styles.myClubs}>
        <Link to="/my-clubs" className={styles.sectionTitle}>
          My Clubs
        </Link>
        {userClubs.length === 0 ? (
          <p className={styles.noClubsText}>No clubs joined yet</p>
        ) : (
          userClubs.map((club) => {
            const isExpanded = expandedClubs[club.clubId];
            return (
              <div key={club.clubId} className={styles.clubItem}>
                <div className={styles.clubHeader} onClick={() => toggleClubMenu(club.clubId)}>
                  <span className={styles.clubName}>{club.clubName}</span>
                  {isExpanded ? <FaChevronDown className={styles.arrow} /> : <FaChevronRight className={styles.arrow} />}
                </div>

                {/* Club Dropdown Links */}
                {isExpanded && (
                  <ul className={styles.clubLinks}>
                  <li>
                    <Link to={`/my-clubs/${club.clubId}/details`}>
                      <HiOutlineClipboardList className={styles.subIcon} /> Details
                    </Link>
                  </li>
                  <li>
                    <Link to={`/my-clubs/${club.clubId}/announcements`}>
                      <HiOutlineSpeakerphone className={styles.subIcon} /> Announcements
                    </Link>
                  </li>
                  <li>
                    <Link to={`/my-clubs/${club.clubId}/events`}>
                      <BsCalendarEvent className={styles.subIcon} /> Events
                    </Link>
                  </li>
                  <li>
                    <Link to={`/my-clubs/${club.clubId}/discussions`}>
                      <GoCommentDiscussion className={styles.subIcon} /> Discussions
                    </Link>
                  </li>
                </ul>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} className={styles.logoutBtn}>
        <span className={styles.icon}><RiLogoutCircleRLine /></span> Logout
      </button>
    </div>
  );
};

export default Sidebar;