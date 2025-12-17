package com.example.hostel.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody; // Import this
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hostel.model.Room;
import com.example.hostel.model.Student;
import com.example.hostel.repository.HostelRepository;
import com.example.hostel.repository.RoomRepository;
import com.example.hostel.repository.StudentRepository;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {

    private final RoomRepository roomRepository;
    private final HostelRepository hostelRepository;
    private final StudentRepository studentRepository; // Add this

    public RoomController(RoomRepository roomRepository, HostelRepository hostelRepository, StudentRepository studentRepository) {
        this.roomRepository = roomRepository;
        this.hostelRepository = hostelRepository;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public List<Room> getAll() {
        return roomRepository.findAll();
    }

    @GetMapping("/hostel/{hostelId}")
    public List<Room> getByHostel(@PathVariable Long hostelId) {
        return roomRepository.findByHostelId(hostelId);
    }

    @PostMapping
    @Transactional
    public Room create(@RequestBody Room room) {
        if (room.getHostel() == null || room.getHostel().getId() == null) {
            throw new IllegalArgumentException("Hostel ID is required");
        }
        
        var hostel = hostelRepository.findById(room.getHostel().getId())
                .orElseThrow(() -> new IllegalArgumentException("Hostel not found"));
        room.setHostel(hostel);
        
        return roomRepository.save(room);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Room> update(@PathVariable Long id, @RequestBody Room roomDetails) {
        return roomRepository.findById(id)
                .map(room -> {
                    if (roomDetails.getRoomNumber() != null) room.setRoomNumber(roomDetails.getRoomNumber());
                    if (roomDetails.getCapacity() > 0) room.setCapacity(roomDetails.getCapacity());
                    if (roomDetails.getFloor() > 0) room.setFloor(roomDetails.getFloor());
                    
                    return ResponseEntity.ok(roomRepository.save(room));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ NEW: Assign Student (Updates Room & Student)
    @PostMapping("/{roomId}/assign/{studentId}")
    @Transactional
    public ResponseEntity<?> assignRoom(@PathVariable Long roomId, @PathVariable Long studentId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));
        Student student = studentRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));

        if (room.getCurrentOccupancy() >= room.getCapacity()) {
            return ResponseEntity.badRequest().body("Room is full!");
        }

        // 1. Link Student to Room
        student.setCurrentRoomId(roomId);
        studentRepository.save(student);

        // 2. Increase Room Occupancy
        room.setCurrentOccupancy(room.getCurrentOccupancy() + 1);
        roomRepository.save(room);

        return ResponseEntity.ok(Map.of("message", "Room assigned successfully"));
    }

    // ✅ NEW: Vacate Student (Removes link & Decreases Occupancy)
    @PostMapping("/vacate/{studentId}")
    @Transactional
    public ResponseEntity<?> vacateRoom(@PathVariable Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getCurrentRoomId() == null) {
            return ResponseEntity.badRequest().body("Student is not assigned to any room.");
        }

        Room room = roomRepository.findById(student.getCurrentRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // 1. Decrease Occupancy
        if (room.getCurrentOccupancy() > 0) {
            room.setCurrentOccupancy(room.getCurrentOccupancy() - 1);
            roomRepository.save(room);
        }

        // 2. Remove Link
        student.setCurrentRoomId(null);
        studentRepository.save(student);

        return ResponseEntity.ok(Map.of("message", "Student released from room"));
    }
}