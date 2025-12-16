package com.example.hostel.controller;

import com.example.hostel.model.AttendanceRecord;
import com.example.hostel.repository.AttendanceRecordRepository;
import com.example.hostel.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceRecordRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceController(AttendanceRecordRepository attendanceRepository, StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<AttendanceRecord> getAll() {
        return attendanceRepository.findAll();
    }

    @GetMapping("/student/{studentId}")
    @Transactional(readOnly = true)
    public List<AttendanceRecord> getByStudent(@PathVariable Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    @GetMapping("/date/{date}")
    @Transactional(readOnly = true)
    public List<AttendanceRecord> getByDate(@PathVariable String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            return attendanceRepository.findByDate(localDate);
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            // Return empty list if date parsing fails or any other error
            return List.of();
        }
    }

    @GetMapping("/student/{studentId}/date/{date}")
    @Transactional(readOnly = true)
    public List<AttendanceRecord> getByStudentAndDate(@PathVariable Long studentId, @PathVariable String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            return attendanceRepository.findByStudentIdAndDate(studentId, localDate);
        } catch (Exception e) {
            return List.of();
        }
    }

    @PostMapping
    @Transactional
    public AttendanceRecord create(@RequestBody AttendanceRecord record) {
        if (record == null || record.getStudent() == null || record.getStudent().getId() == null) {
            throw new IllegalArgumentException("Student is required");
        }
        
        // Load the student entity
        var student = studentRepository.findById(record.getStudent().getId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        record.setStudent(student);
        
        if (record.getDate() == null) {
            record.setDate(LocalDate.now());
        }
        if (record.getStatus() == null || record.getStatus().trim().isEmpty()) {
            record.setStatus("PRESENT");
        }
        
        AttendanceRecord saved = attendanceRepository.save(record);
        attendanceRepository.flush();
        return saved;
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<AttendanceRecord> update(@PathVariable Long id, @RequestBody AttendanceRecord record) {
        return attendanceRepository.findById(id)
                .map(existing -> {
                    if (record.getStatus() != null) existing.setStatus(record.getStatus());
                    if (record.getCheckInTime() != null) existing.setCheckInTime(record.getCheckInTime());
                    if (record.getCheckOutTime() != null) existing.setCheckOutTime(record.getCheckOutTime());
                    if (record.getRemarks() != null) existing.setRemarks(record.getRemarks());
                    
                    AttendanceRecord updated = attendanceRepository.save(existing);
                    attendanceRepository.flush();
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceRecord> getById(@PathVariable Long id) {
        return attendanceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

