package org.elevate.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.elevate.models.*;
import org.elevate.dtos.AnnouncementResponseDTO;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    // Fetch all announcements for a club (with seen status)
    @Query("""
        SELECT new org.elevate.dtos.AnnouncementResponseDTO(
            a.id, a.title, a.content, a.type, a.createdAt,
            COALESCE(ua.isSeen, false), a.announcementImage
        )
        FROM Announcement a
        INNER JOIN UserAnnouncement ua ON ua.announcement.id = a.id AND ua.user.userId = :userId
        WHERE a.club.clubId = :clubId AND a.type = :type
    """)
    Page<AnnouncementResponseDTO> findAllAnnouncementsWithSeenStatusAndType(
        @Param("userId") Long userId,
        @Param("clubId") Long clubId,
        @Param("type") AnnouncementType type,
        Pageable pageable
    );

    // Fetch only unseen announcements for a club
    @Query("""
        SELECT new org.elevate.dtos.AnnouncementResponseDTO(
            a.id, a.title, a.content, a.type, a.createdAt,
            COALESCE(ua.isSeen, false), a.announcementImage
        )
        FROM Announcement a
        INNER JOIN UserAnnouncement ua ON ua.announcement.id = a.id AND ua.user.userId = :userId
        WHERE a.club.clubId = :clubId AND a.type = :type AND (ua.isSeen IS NULL OR ua.isSeen = false)
    """)
    Page<AnnouncementResponseDTO> findUnseenAnnouncementsWithSeenStatusAndType(
        @Param("userId") Long userId,
        @Param("clubId") Long clubId,
        @Param("type") AnnouncementType type,
        Pageable pageable
    );

}
