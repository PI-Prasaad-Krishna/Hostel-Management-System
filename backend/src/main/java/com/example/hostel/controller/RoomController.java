package com.example.hostel.controller;

import com.example.hostel.model.Room;
import com.example.hostel.repository.RoomRepository;
import com.example.hostel.repository.HostelRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomRepository roomRepository;
    private final HostelRepository hostelRepository;

    public RoomController(RoomRepository roomRepository, HostelRepository hostelRepository) {
        this.roomRepository = roomRepository;
        this.hostelRepository = hostelRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
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
        if (room == null || room.getHostel() == null || room.getHostel().getId() == null) {
            throw new IllegalArgumentException("Room and Hostel ID are required");
        }
        if (room.getCapacity() == null || room.getCapacity() <= 0) {
            throw new IllegalArgumentException("Room capacity must be greater than 0");
        }
        
        // Load the hostel entity
        var hostel = hostelRepository.findById(room.getHostel().getId())
                .orElseThrow(() -> new IllegalArgumentException("Hostel not found"));
        room.setHostel(hostel);
        
        // Set default values
        if (room.getCurrentOccupancy() == null) {
            room.setCurrentOccupancy(0);
        }
        if (room.getStatus() == null) {
            room.setStatus("VACANT");
        }
        
        Room saved = roomRepository.save(room);
        roomRepository.flush();
        return saved;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getById(@PathVariable Long id) {
        return roomRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Room> update(@PathVariable Long id, @RequestBody Room room) {
        return roomRepository.findById(id)
                .map(existing -> {
                    if (room.getRoomNo() != null) existing.setRoomNo(room.getRoomNo());
                    if (room.getFloorNo() != null) existing.setFloorNo(room.getFloorNo());
                    if (room.getType() != null) existing.setType(room.getType());
                    if (room.getCapacity() != null) existing.setCapacity(room.getCapacity());
                    if (room.getCurrentOccupancy() != null) existing.setCurrentOccupancy(room.getCurrentOccupancy());
                    if (room.getGender() != null) existing.setGender(room.getGender());
                    if (room.getStatus() != null) existing.setStatus(room.getStatus());
                    
                    Room updated = roomRepository.save(existing);
                    roomRepository.flush();
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

