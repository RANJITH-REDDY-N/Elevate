import styles from "../styles/Pagination.module.css";
import { useEffect, useRef } from "react";
import { FaLessThan, FaGreaterThan } from "react-icons/fa";
const Pagination = ({ totalPages, setPage, page }) => {
  const paginationULRef = useRef(null);
  const showOnly = 3;

  /** ✅ Ensure valid totalPages */
  useEffect(() => {
    if (!totalPages || totalPages < 1) return;
    renderPages();
  }, [totalPages, page]);

  const renderPages = () => {
    if (!paginationULRef.current || totalPages < 1) return;

    paginationULRef.current.innerHTML = "";
    const mid = Math.floor(showOnly / 2);
    for (let index = 1; index <= totalPages; index++) {
      
      const liEle = document.createElement("li");
      liEle.classList.add("page-item");
      liEle.textContent = index;

      if (index === page + 1) {
        liEle.classList.add("active");
      }

      liEle.onclick = () => setPage(index - 1);
      paginationULRef.current.appendChild(liEle);
    }
  };

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.pagination}>
        
        <button id="prev-page" aria-label="Previous Page" disabled={page === 0} onClick={() => setPage((prev) => (prev > 0 ? prev - 1 : 0))} title="Go To Previous Page">
        <FaLessThan />
        </button>


        <ul ref={paginationULRef}></ul>

        <button id="nxt-page" disabled={page >= totalPages - 1} aria-label="Next Page" title="Go To Next Page" onClick={() => setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))}>
        <FaGreaterThan />
        </button>
      </div>
    </div>
  );
};

export default Pagination;