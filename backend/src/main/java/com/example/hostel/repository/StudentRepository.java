package com.example.hostel.repository;

import com.example.hostel.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // Check if a student exists using roll number
    boolean existsByRollNo(String rollNo);

    // Fetch student details using roll number
    Optional<Student> findByRollNo(String rollNo);
}
