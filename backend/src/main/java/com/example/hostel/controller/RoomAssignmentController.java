package com.example.hostel.controller;

import com.example.hostel.model.RoomAssignment;
import com.example.hostel.repository.RoomAssignmentRepository;
import com.example.hostel.repository.StudentRepository;
import com.example.hostel.repository.RoomRepository;
import com.example.hostel.model.Student;
import com.example.hostel.model.Room;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/room-assignments")
@CrossOrigin(origins = "*")
public class RoomAssignmentController {

    private final RoomAssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;

    public RoomAssignmentController(
            RoomAssignmentRepository assignmentRepository,
            StudentRepository studentRepository,
            RoomRepository roomRepository) {
        this.assignmentRepository = assignmentRepository;
        this.studentRepository = studentRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<RoomAssignment> getAll() {
        return assignmentRepository.findAll();
    }

    @GetMapping("/student/{studentId}")
    @Transactional(readOnly = true)
    public List<RoomAssignment> getByStudent(@PathVariable Long studentId) {
        return assignmentRepository.findByStudentId(studentId);
    }

    @GetMapping("/room/{roomId}")
    @Transactional(readOnly = true)
    public List<RoomAssignment> getByRoom(@PathVariable Long roomId) {
        return assignmentRepository.findByRoomId(roomId);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<RoomAssignment> assignRoom(@RequestBody RoomAssignment assignment) {
        if (assignment.getStudent() == null || assignment.getStudent().getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        if (assignment.getRoom() == null || assignment.getRoom().getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        if (assignment.getStartDate() == null) {
            assignment.setStartDate(LocalDate.now());
        }

        Student student = studentRepository.findById(assignment.getStudent().getId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        Room room = roomRepository.findById(assignment.getRoom().getId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        // Update student's current room
        student.setCurrentRoom(room);
        studentRepository.save(student);

        // Update room occupancy
        int currentOccupancy = room.getCurrentOccupancy() != null ? room.getCurrentOccupancy() : 0;
        room.setCurrentOccupancy(currentOccupancy + 1);
        
        if (room.getCurrentOccupancy() >= room.getCapacity()) {
            room.setStatus("FULL");
        } else if (room.getCurrentOccupancy() > 0) {
            room.setStatus("PARTIAL");
        }
        roomRepository.save(room);

        assignment.setStudent(student);
        assignment.setRoom(room);
        
        RoomAssignment saved = assignmentRepository.save(assignment);
        assignmentRepository.flush();
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/release")
    @Transactional
    public ResponseEntity<RoomAssignment> releaseRoom(@PathVariable Long id) {
        try {
            RoomAssignment assignment = assignmentRepository.findById(id)
                    .orElse(null);
            
            if (assignment == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Check if already released
            if (assignment.getEndDate() != null) {
                return ResponseEntity.badRequest().build();
            }
            
            assignment.setEndDate(LocalDate.now());
            
            // Update room occupancy - need to reload room to get current state
            Room room = roomRepository.findById(assignment.getRoom().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Room not found"));
            
            int currentOccupancy = room.getCurrentOccupancy() != null ? room.getCurrentOccupancy() : 0;
            room.setCurrentOccupancy(Math.max(0, currentOccupancy - 1));
            
            if (room.getCurrentOccupancy() == 0) {
                room.setStatus("VACANT");
            } else {
                room.setStatus("PARTIAL");
            }
            roomRepository.save(room);
            roomRepository.flush();

            // Clear student's current room if this was their current assignment
            Student student = studentRepository.findById(assignment.getStudent().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Student not found"));
            
            if (student.getCurrentRoom() != null && student.getCurrentRoom().getId().equals(room.getId())) {
                student.setCurrentRoom(null);
                studentRepository.save(student);
                studentRepository.flush();
            }

            RoomAssignment updated = assignmentRepository.save(assignment);
            assignmentRepository.flush();
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

