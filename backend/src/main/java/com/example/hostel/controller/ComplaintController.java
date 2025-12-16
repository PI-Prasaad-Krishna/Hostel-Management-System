package com.example.hostel.controller;

import com.example.hostel.model.Complaint;
import com.example.hostel.repository.ComplaintRepository;
import com.example.hostel.repository.StudentRepository;
import com.example.hostel.repository.RoomRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintRepository complaintRepository;
    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;

    public ComplaintController(ComplaintRepository complaintRepository, StudentRepository studentRepository, RoomRepository roomRepository) {
        this.complaintRepository = complaintRepository;
        this.studentRepository = studentRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<Complaint> getAll() {
        return complaintRepository.findAll();
    }

    @GetMapping("/student/{studentId}")
    @Transactional(readOnly = true)
    public List<Complaint> getByStudent(@PathVariable Long studentId) {
        return complaintRepository.findByStudentId(studentId);
    }

    @GetMapping("/status/{status}")
    @Transactional(readOnly = true)
    public List<Complaint> getByStatus(@PathVariable String status) {
        // Handle URL encoding - decode if needed
        String decodedStatus = status.replace("%20", "_").replace("-", "_");
        String dbStatus = decodedStatus.toUpperCase();
        
        // Valid statuses: OPEN, IN_PROGRESS, RESOLVED, CLOSED
        // Handle both IN_PROGRESS and IN-PROGRESS formats
        if (dbStatus.equals("IN-PROGRESS")) {
            dbStatus = "IN_PROGRESS";
        }
        
        if (!dbStatus.equals("OPEN") && !dbStatus.equals("IN_PROGRESS") && 
            !dbStatus.equals("RESOLVED") && !dbStatus.equals("CLOSED")) {
            // Return empty list for invalid status instead of error
            return List.of();
        }
        return complaintRepository.findByStatus(dbStatus);
    }

    @PostMapping
    @Transactional
    public Complaint create(@RequestBody Complaint complaint) {
        if (complaint == null || complaint.getTitle() == null || complaint.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Complaint title is required");
        }
        if (complaint.getStudent() == null || complaint.getStudent().getId() == null) {
            throw new IllegalArgumentException("Student is required");
        }
        
        // Load the student entity
        var student = studentRepository.findById(complaint.getStudent().getId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        complaint.setStudent(student);
        
        // Load room if provided
        if (complaint.getRoom() != null && complaint.getRoom().getId() != null) {
            var room = roomRepository.findById(complaint.getRoom().getId())
                    .orElse(null); // Room is optional
            complaint.setRoom(room);
        } else {
            complaint.setRoom(null);
        }
        
        if (complaint.getStatus() == null) {
            complaint.setStatus("OPEN");
        }
        
        Complaint saved = complaintRepository.save(complaint);
        complaintRepository.flush();
        return saved;
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Complaint> update(@PathVariable Long id, @RequestBody Complaint complaint) {
        return complaintRepository.findById(id)
                .map(existing -> {
                    if (complaint.getTitle() != null) existing.setTitle(complaint.getTitle());
                    if (complaint.getDescription() != null) existing.setDescription(complaint.getDescription());
                    if (complaint.getCategory() != null) existing.setCategory(complaint.getCategory());
                    if (complaint.getStatus() != null) existing.setStatus(complaint.getStatus());
                    
                    Complaint updated = complaintRepository.save(existing);
                    complaintRepository.flush();
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getById(@PathVariable Long id) {
        return complaintRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

