package com.example.hostel.controller;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hostel.model.Room;
import com.example.hostel.model.RoomAssignment;
import com.example.hostel.model.Student;
import com.example.hostel.repository.RoomAssignmentRepository;
import com.example.hostel.repository.RoomRepository;
import com.example.hostel.repository.StudentRepository;

@RestController
@RequestMapping("/api/room-assignments")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomAssignmentController {

    private final RoomAssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;

    public RoomAssignmentController(RoomAssignmentRepository assignmentRepository, StudentRepository studentRepository, RoomRepository roomRepository) {
        this.assignmentRepository = assignmentRepository;
        this.studentRepository = studentRepository;
        this.roomRepository = roomRepository;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> assignRoom(@RequestBody RoomAssignment req) {
        // 1. Fetch Entities
        Student student = studentRepository.findById(req.getStudent().getId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Room room = roomRepository.findById(req.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // 2. Validate Room Capacity
        if (room.getCurrentOccupancy() >= room.getCapacity()) {
            return ResponseEntity.badRequest().body("Room is already full!");
        }

        // 3. Create Assignment
        RoomAssignment assignment = new RoomAssignment();
        assignment.setStudent(student);
        assignment.setRoom(room);
        assignment.setStartDate(LocalDate.now());
        assignmentRepository.save(assignment);

        // 4. Update Room Occupancy
        room.setCurrentOccupancy(room.getCurrentOccupancy() + 1);
        roomRepository.save(room);

        // 5. Update Student's Current Room
        student.setCurrentRoomId(room.getId());

        studentRepository.save(student);

        return ResponseEntity.ok("Room Assigned Successfully");
    }

    @PutMapping("/{id}/release")
    @Transactional
    public ResponseEntity<?> releaseRoom(@PathVariable Long id) {
        RoomAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        if (assignment.getEndDate() != null) {
            return ResponseEntity.badRequest().body("Room already released");
        }

        // 1. Mark as ended
        assignment.setEndDate(LocalDate.now());
        assignmentRepository.save(assignment);

        // 2. Decrement Occupancy
        Room room = assignment.getRoom();
        room.setCurrentOccupancy(Math.max(0, room.getCurrentOccupancy() - 1));
        roomRepository.save(room);

        // 3. Clear Student Record
        Student student = assignment.getStudent();
        if (student != null) {
            student.setCurrentRoomId(null);

            studentRepository.save(student);
        }

        return ResponseEntity.ok("Room Released Successfully");
    }
}