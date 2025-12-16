package com.example.hostel.repository;

import com.example.hostel.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("SELECT r FROM Room r LEFT JOIN FETCH r.hostel WHERE r.hostel.id = :hostelId")
    List<Room> findByHostelId(@Param("hostelId") Long hostelId);
}

