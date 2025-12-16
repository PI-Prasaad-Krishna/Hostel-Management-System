package com.example.hostel.repository;

import com.example.hostel.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    @Query("SELECT DISTINCT c FROM Complaint c LEFT JOIN FETCH c.student LEFT JOIN FETCH c.room r LEFT JOIN FETCH r.hostel WHERE c.student.id = :studentId")
    List<Complaint> findByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT DISTINCT c FROM Complaint c LEFT JOIN FETCH c.student LEFT JOIN FETCH c.room r LEFT JOIN FETCH r.hostel WHERE c.status = :status")
    List<Complaint> findByStatus(@Param("status") String status);
    
    @Override
    @Query("SELECT DISTINCT c FROM Complaint c LEFT JOIN FETCH c.student LEFT JOIN FETCH c.room r LEFT JOIN FETCH r.hostel")
    List<Complaint> findAll();
}

