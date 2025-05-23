import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllClubs } from "../services/api";
import styles from "../styles/ExploreClubs.module.css";

const ExploreClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadClubs = async () => {
      try {
        const response = await fetchAllClubs();
        if (!response.error) {
          setClubs(response.data);
        }
      } catch (error) {
        console.error("Error fetching clubs:", error);
      }
    };

    loadClubs();
  }, []);

  return (
    <div className={styles.exploreClubsContainer}>
      <div className={styles.header}>
        <h2>Explore Clubs</h2>
        {/* <button className={styles.moreButton} onClick={() => navigate("/explore")}>
          Show More
        </button> */}
      </div>
      <div className={styles.clubGrid} style={{ maxHeight: expanded ? "none" : "250px" }}>
        {clubs.map((club) => (
          <div key={club.id} className={styles.clubCard}>
            <img src={club.imageUrl} alt={club.name} className={styles.clubImage} />
            <div className={styles.overlay}>
              <h3 className={styles.clubName}>{club.clubName}</h3>
            </div>
          </div>
        ))}
      </div>
      {!expanded && (
        <button className={styles.showMore} onClick={() => navigate("/explore")}>
          Show More
        </button>
      )}
    </div>
  );
};

export default ExploreClubs;