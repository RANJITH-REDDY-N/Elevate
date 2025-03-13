import { useParams } from "react-router-dom";
import styles from "../styles/ClubDiscussions.module.css";

const ClubDiscussions = () => {
  const { clubId } = useParams();

  return (
    <div className={styles.discussionsContainer}>
      <p>💬 Engage in discussions related to {clubId}.</p>
    </div>
  );
};

export default ClubDiscussions;