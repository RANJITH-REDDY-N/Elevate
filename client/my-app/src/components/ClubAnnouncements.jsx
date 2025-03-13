import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchAnnouncements } from "../services/api";
import Pagination from "../components/Pagination";
import styles from "../styles/ClubAnnouncements.module.css";

const ClubAnnouncements = () => {
  const { clubId } = useParams();
  const userId = useSelector((state) => state.user?.user?.userId);
  const [announcements, setAnnouncements] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (clubId && userId) {
      fetchAnnouncements({ userId, clubId, page, size: 4 }).then((response) => {
        if (!response.error) {
          setAnnouncements(response.data.content);
          setTotalPages(response.data.totalPages);
        }
      });
    }
  }, [clubId, userId, page]);

  return (
    <div className={styles.announcementsContainer}>
      {announcements.length > 0 ? (
        announcements.map((announcement) => (
          <div key={announcement.id} className={styles.announcementItem}>
            <p className={styles.announcementDate}>{new Date(announcement.createdAt).toLocaleDateString()}</p>
            <h3 className={styles.announcementTitle}>{announcement.title}</h3>
            <p className={styles.announcementSummary}>{announcement.content}</p>
          </div>
        ))
      ) : (
        <p>No announcements available.</p>
      )}

      {/* Pagination */}
      <Pagination totalPages={totalPages} page={page} setPage={setPage} />
    </div>
  );
};

export default ClubAnnouncements;