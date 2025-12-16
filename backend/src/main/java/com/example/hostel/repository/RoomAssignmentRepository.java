package com.example.hostel.repository;

import com.example.hostel.model.RoomAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RoomAssignmentRepository extends JpaRepository<RoomAssignment, Long> {
    @Query("SELECT DISTINCT ra FROM RoomAssignment ra LEFT JOIN FETCH ra.student LEFT JOIN FETCH ra.room r LEFT JOIN FETCH r.hostel WHERE ra.student.id = :studentId")
    List<RoomAssignment> findByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT DISTINCT ra FROM RoomAssignment ra LEFT JOIN FETCH ra.student LEFT JOIN FETCH ra.room r LEFT JOIN FETCH r.hostel WHERE ra.room.id = :roomId")
    List<RoomAssignment> findByRoomId(@Param("roomId") Long roomId);
    
    @Override
    @Query("SELECT DISTINCT ra FROM RoomAssignment ra LEFT JOIN FETCH ra.student LEFT JOIN FETCH ra.room r LEFT JOIN FETCH r.hostel")
    List<RoomAssignment> findAll();
}

