package com.example.hostel.controller;

import com.example.hostel.model.Room;
import com.example.hostel.repository.RoomRepository;
import com.example.hostel.repository.StudentRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final StudentRepository studentRepository;
    private final RoomRepository roomRepository;

    public DashboardController(StudentRepository studentRepository, RoomRepository roomRepository) {
        this.studentRepository = studentRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // 1. Total Students
        long totalStudents = studentRepository.count();
        stats.put("totalStudents", totalStudents);

        // 2. Room Calculations
        List<Room> allRooms = roomRepository.findAll();
        
        long totalRooms = allRooms.size();
        long totalCapacity = allRooms.stream().mapToLong(Room::getCapacity).sum();
        long occupiedBeds = allRooms.stream().mapToLong(Room::getCurrentOccupancy).sum();
        long vacantBeds = totalCapacity - occupiedBeds;

        stats.put("totalRooms", totalRooms);
        stats.put("totalCapacity", totalCapacity);
        stats.put("occupiedBeds", occupiedBeds);
        stats.put("vacantBeds", vacantBeds);

        // 3. Occupancy Rate (Avoid division by zero)
        double occupancyRate = (totalCapacity > 0) ? ((double) occupiedBeds / totalCapacity) * 100 : 0;
        stats.put("occupancyRate", Math.round(occupancyRate * 10.0) / 10.0); // Round to 1 decimal

        // 4. Pending Complaints (Placeholder until we build Option 2)
        stats.put("pendingComplaints", 0); 

        return stats;
    }
}