package com.example.hostel.controller;

import com.example.hostel.model.Hostel;
import com.example.hostel.repository.HostelRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hostels")
@CrossOrigin(origins = "*")
public class HostelController {

    private final HostelRepository hostelRepository;

    public HostelController(HostelRepository hostelRepository) {
        this.hostelRepository = hostelRepository;
    }

    @GetMapping
    public List<Hostel> getAll() {
        return hostelRepository.findAll();
    }

    @PostMapping
    @Transactional
    public Hostel create(@RequestBody Hostel hostel) {
        if (hostel == null) {
            throw new IllegalArgumentException("Hostel cannot be null");
        }

        // Validate required fields
        if (hostel.getName() == null || hostel.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Hostel name is required");
        }
        if (hostel.getCode() == null || hostel.getCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Hostel code is required");
        }

        Hostel saved = hostelRepository.save(hostel);
        hostelRepository.flush(); // Force immediate write to database
        return saved;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hostel> getById(@PathVariable Long id) {
        if (id == null) {
            return ResponseEntity.badRequest().build();
        }
        return hostelRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
