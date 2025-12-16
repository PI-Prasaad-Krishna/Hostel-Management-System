package com.example.hostel.repository;

import com.example.hostel.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    @Query("SELECT DISTINCT a FROM AttendanceRecord a LEFT JOIN FETCH a.student WHERE a.student.id = :studentId")
    List<AttendanceRecord> findByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT DISTINCT a FROM AttendanceRecord a LEFT JOIN FETCH a.student WHERE a.date = :date")
    List<AttendanceRecord> findByDate(@Param("date") LocalDate date);
    
    @Query("SELECT DISTINCT a FROM AttendanceRecord a LEFT JOIN FETCH a.student WHERE a.student.id = :studentId AND a.date = :date")
    List<AttendanceRecord> findByStudentIdAndDate(@Param("studentId") Long studentId, @Param("date") LocalDate date);
    
    @Override
    @Query("SELECT DISTINCT a FROM AttendanceRecord a LEFT JOIN FETCH a.student")
    List<AttendanceRecord> findAll();
}

