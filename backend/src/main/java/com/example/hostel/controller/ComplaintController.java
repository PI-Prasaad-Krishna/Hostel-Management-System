package com.example.hostel.controller;

import com.example.hostel.model.Complaint;
import com.example.hostel.model.Room;
import com.example.hostel.model.Student;
import com.example.hostel.repository.ComplaintRepository;
import com.example.hostel.repository.RoomRepository;
import com.example.hostel.repository.StudentRepository;

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

    public ComplaintController(
            ComplaintRepository complaintRepository,
            StudentRepository studentRepository,
            RoomRepository roomRepository
    ) {
        this.complaintRepository = complaintRepository;
        this.studentRepository = studentRepository;
        this.roomRepository = roomRepository;
    }

    /* =========================
       GET ALL COMPLAINTS (ADMIN)
       ========================= */

    @GetMapping
    @Transactional(readOnly = true)
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    /* =========================
       GET COMPLAINTS BY STUDENT
       ========================= */

    @GetMapping("/student/{studentId}")
    @Transactional(readOnly = true)
    public List<Complaint> getComplaintsByStudent(@PathVariable Long studentId) {
        return complaintRepository.findByStudent_Id(studentId);
    }

    /* =========================
       CREATE COMPLAINT (STUDENT)
       ========================= */

   @PostMapping
@Transactional
public ResponseEntity<?> createComplaint(@RequestBody Complaint request) {

    System.out.println("===== CREATE COMPLAINT CALLED =====");

    System.out.println("TITLE: " + request.getTitle());
    System.out.println("PRIORITY: " + request.getPriority());

    if (request.getStudent() == null) {
        System.out.println("STUDENT OBJECT IS NULL");
        return ResponseEntity.badRequest().body("Student object is null");
    }

    System.out.println("STUDENT ROLL NO: " + request.getStudent().getRollNo());

    if (request.getStudent().getRollNo() == null) {
        System.out.println("ROLL NO IS NULL");
        return ResponseEntity.badRequest().body("Roll number is null");
    }

    Student student = studentRepository
            .findByRollNo(request.getStudent().getRollNo())
            .orElse(null);

    if (student == null) {
        System.out.println("STUDENT NOT FOUND IN DB BY ROLL NO");
        return ResponseEntity.badRequest().body("Student not found");
    }

    request.setStudent(student);
    request.setStatus("OPEN");

    Complaint saved = complaintRepository.save(request);
    return ResponseEntity.ok(saved);
}



    /* =========================
       RESOLVE COMPLAINT (ADMIN)
       ========================= */

    @PutMapping("/{id}/resolve")
    @Transactional
    public ResponseEntity<Complaint> resolveComplaint(@PathVariable Long id) {
        return complaintRepository.findById(id)
                .map(complaint -> {
                    complaint.setStatus("RESOLVED");
                    Complaint updated = complaintRepository.save(complaint);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /* =========================
       UPDATE COMPLAINT (OPTIONAL)
       ========================= */

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Complaint> updateComplaint(
            @PathVariable Long id,
            @RequestBody Complaint update
    ) {
        return complaintRepository.findById(id)
                .map(existing -> {
                    if (update.getTitle() != null) {
                        existing.setTitle(update.getTitle());
                    }
                    if (update.getDescription() != null) {
                        existing.setDescription(update.getDescription());
                    }
                    if (update.getCategory() != null) {
                        existing.setCategory(update.getCategory());
                    }
                    if (update.getPriority() != null) {
                        existing.setPriority(update.getPriority());
                    }
                    if (update.getStatus() != null) {
                        existing.setStatus(update.getStatus());
                    }

                    Complaint saved = complaintRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /* =========================
       GET COMPLAINT BY ID
       ========================= */

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<Complaint> getComplaintById(@PathVariable Long id) {
        return complaintRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
