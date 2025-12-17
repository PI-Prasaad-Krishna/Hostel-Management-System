package com.example.hostel.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity; // <--- Import Room
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin; // <--- Import RoomRepository
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hostel.dto.HostelRequest;
import com.example.hostel.model.Hostel;
import com.example.hostel.model.Room;
import com.example.hostel.repository.HostelRepository;
import com.example.hostel.repository.RoomRepository;

@RestController
@RequestMapping("/api/hostels")
@CrossOrigin(origins = "http://localhost:5173")
public class HostelController {

    private final HostelRepository hostelRepository;
    private final RoomRepository roomRepository; // <--- 1. Define RoomRepository

    // 2. Update Constructor to include RoomRepository
    public HostelController(HostelRepository hostelRepository, RoomRepository roomRepository) {
        this.hostelRepository = hostelRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public List<Hostel> getAllHostels() {
        return hostelRepository.findAll();
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> addHostel(@RequestBody HostelRequest request) {
        System.out.println("Adding Hostel: " + request.getName()); 

        Hostel hostel = new Hostel();
        hostel.setName(request.getName());
        hostel.setType(request.getType());
        hostel.setAddress(request.getAddress());
        hostel.setWardenName(request.getWardenName());
        
        // Calculate Capacity
        int floors = (request.getTotalFloors() != null) ? request.getTotalFloors() : 1;
        int roomsPerFloor = (request.getRoomsPerFloor() != null) ? request.getRoomsPerFloor() : 10;
        int capacity = floors * roomsPerFloor * 2; 
        
        hostel.setCapacity(capacity);

        // Save Hostel
        Hostel savedHostel = hostelRepository.save(hostel);

        // --- 3. THE MISSING MAGIC: Auto-Generate Rooms ---
        if (request.getTotalFloors() != null && request.getRoomsPerFloor() != null) {
            System.out.println("Generating " + (floors * roomsPerFloor) + " rooms...");
            
            for (int floor = 1; floor <= floors; floor++) {
                for (int roomNum = 1; roomNum <= roomsPerFloor; roomNum++) {
                    // Create Room Number (e.g., 101, 102... 201, 202)
                    String roomNumber = floor + String.format("%02d", roomNum); 
                    
                    Room room = new Room();
                    room.setRoomNumber(roomNumber);
                    room.setFloor(floor);
                    room.setCapacity(2); // Default capacity
                    room.setHostel(savedHostel); // Link to the new Hostel
                    
                    roomRepository.save(room); // Save to DB
                }
            }
        }
        // ------------------------------------------------

        return ResponseEntity.ok(Map.of("message", "Hostel and Rooms created successfully!"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHostel(@PathVariable Long id) {
        if(hostelRepository.existsById(id)) {
            hostelRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Hostel deleted"));
        }
        return ResponseEntity.notFound().build();
    }
}