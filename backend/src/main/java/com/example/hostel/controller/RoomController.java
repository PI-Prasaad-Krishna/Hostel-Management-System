package com.example.hostel.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hostel.model.Room;
import com.example.hostel.repository.HostelRepository;
import com.example.hostel.repository.RoomRepository;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173") // Fixed CORS
public class RoomController {

    private final RoomRepository roomRepository;
    private final HostelRepository hostelRepository;

    public RoomController(RoomRepository roomRepository, HostelRepository hostelRepository) {
        this.roomRepository = roomRepository;
        this.hostelRepository = hostelRepository;
    }

    @GetMapping
    public List<Room> getAll() {
        return roomRepository.findAll();
    }

    @GetMapping("/hostel/{hostelId}")
    public List<Room> getByHostel(@PathVariable Long hostelId) {
        return roomRepository.findByHostelId(hostelId);
    }

    // We keep this simpler now since Hostels auto-generate rooms
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
                    // Update only what exists in our new Model
                    if (roomDetails.getRoomNumber() != null) room.setRoomNumber(roomDetails.getRoomNumber());
                    if (roomDetails.getCapacity() > 0) room.setCapacity(roomDetails.getCapacity());
                    if (roomDetails.getFloor() > 0) room.setFloor(roomDetails.getFloor());
                    
                    return ResponseEntity.ok(roomRepository.save(room));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}