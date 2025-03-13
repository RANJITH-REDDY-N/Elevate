import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllClubs, requestToJoinClub } from "../services/api";
import { updateUserRequests } from "../redux/userSlice"; // Action to update Redux state
import styles from "../styles/ExplorePage.module.css";

const ExplorePage = () => {
  const dispatch = useDispatch();
  const [clubs, setClubs] = useState([]);
  const [joinReasons, setJoinReasons] = useState({});

  // Redux store for user club requests
  const userDetails = useSelector((state) => state.user.user);
  const userRequests = useSelector((state) => state.user.userRequestClubs);
  const userClubs = useSelector((state) => state.user.userJoinedClubs);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clubsResponse = await fetchAllClubs();
        if (!clubsResponse.error) {
          let sortedClubs = clubsResponse.data.sort((a, b) => {
            const aStatus = getRequestStatus(a.clubId).status;
            const bStatus = getRequestStatus(b.clubId).status;
            return aStatus === "NONE" ? -1 : 1; 
          });
          setClubs(sortedClubs);
        }
      } catch (error) {
        console.error("Error fetching all clubs data:", error);
      }
    };

    fetchData();
  }, []);

  const getRequestStatus = (clubId) => {
    const request = userRequests.find((req) => req.clubId === clubId);
    if (userClubs.some((club) => club.clubId === clubId)) {
      return { text: "Joined", className: styles.approved, disabled: true, status: "JOINED" };
    }
    if (request?.requestStatus === "PENDING") {
      return { text: "Request Sent ✓", className: styles.pending, disabled: true, status: "PENDING" };
    }
    if (request?.requestStatus === "REJECTED") {
      return { text: "Resend Request", className: styles.rejected, disabled: false, status: "REJECTED" };
    }
    return { text: "Request to Join", className: "", disabled: false, status: "NONE" };
  };

  const handleInputChange = (clubId, value) => {
    setJoinReasons((prev) => ({
      ...prev,
      [clubId]: value,
    }));
  };

const handleJoinRequest = async (clubId) => {
  const userComment = joinReasons[clubId]?.trim();
  if (!userComment) return alert("Please enter a reason to join.");

  const requestData = {
    userId: userDetails.userId, // Fetching from Redux
    clubId: clubId,
    userComment: userComment,
  };

  try {
    // First, send the API request
    const response = await requestToJoinClub(requestData);
    if (response && response.data.requestStatus === "PENDING") {
      dispatch(updateUserRequests(response.data)); 
      setJoinReasons((prev) => ({ ...prev, [clubId]: "" }));
    } else {
      alert(response.message || "Failed to send request. Try again.");
    }
  } catch (error) {
    console.error("Error sending join request:", error);
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <div className={styles.exploreContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <h2 className={styles.title}>Explore Clubs</h2>
        <input
          type="text"
          placeholder="Search Clubs"
          className={styles.searchInput}
          onChange={(e) => {
            const searchTerm = e.target.value.toLowerCase();
            setClubs((prevClubs) =>
              prevClubs.filter((club) =>
                club.clubName.toLowerCase().includes(searchTerm)
              )
            );
          }}
        />
      </div>

      {/* Clubs Grid */}
      <div className={styles.clubGrid}>
        {clubs.map((club) => {
          const { text, className, disabled, status } = getRequestStatus(club.clubId);

          return (
            <div key={club.clubId} className={styles.clubCard}>
              {/* Club Image & Header */}
              <div className={styles.clubHeader}>
                <div className={styles.clubImageContainer}>
                  <img
                    src={club.clubImageUrl || "/placeholder-image.png"}
                    alt={club.clubName}
                    className={styles.clubImage}
                  />
                </div>
                <div className={styles.clubDetails}>
                  <h3 className={styles.clubName}>{club.clubName}</h3>
                  <p className={styles.clubMembers}>{club.noOfMembers} Members</p>
                  <p className={styles.clubDescription}>{club.description}</p>
                </div>
              </div>

              {/* Request Section (Only visible if user is eligible) */}
              {status === "NONE" || status === "REJECTED" ? (
                <div className={styles.requestSection}>
                  <label className={styles.question}>Why do you want to join?</label>
                  <textarea
                    className={styles.reasonInput}
                    value={joinReasons[club.clubId] || ""}
                    onChange={(e) => handleInputChange(club.clubId, e.target.value)}
                    maxLength={255}
                    placeholder="Enter your reason (max 255 characters)"
                  />
                </div>
              ) : null}

              {/* Join Button (Only one button per card) */}
              <button
                className={`${styles.joinButton} ${className}`}
                disabled={disabled}
                onClick={() => status === "NONE" || status === "REJECTED" ? handleJoinRequest(club.clubId) : null}
              >
                {text}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExplorePage;