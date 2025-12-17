package com.example.hostel.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hostel.model.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
    // This was missing!
    boolean existsByRollNo(String rollNo);
    
    Optional<Student> findByRollNo(String rollNo);
}