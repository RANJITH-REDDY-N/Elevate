import { useParams } from "react-router-dom";
import styles from "../styles/ClubEvents.module.css";

const ClubEvents = () => {
  const { clubId } = useParams();

  return (
    <div className={styles.eventsContainer}>
      <p>📅 Upcoming events for {clubId} will be displayed here.</p>
    </div>
  );
};

export default ClubEvents;