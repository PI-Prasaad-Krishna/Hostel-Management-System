package com.example.hostel.repository;

import com.example.hostel.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    // Get all complaints of a specific student
    List<Complaint> findByStudent_Id(Long studentId);

    // Get complaints by status (OPEN, RESOLVED, etc.)
    List<Complaint> findByStatus(String status);
}
