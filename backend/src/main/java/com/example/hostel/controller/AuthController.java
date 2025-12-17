package com.example.hostel.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hostel.model.User;
import com.example.hostel.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        // Frontend sends "email" or "username" field, handle both
        String username = loginData.get("email"); 
        if (username == null) username = loginData.get("username");
        
        String password = loginData.get("password");

        // CHANGED: Search by Username (Roll No) instead of Email
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                // Return User Info
                return ResponseEntity.ok(Map.of(
                    "token", "dummy-token-" + user.getId(), // In real app, use JWT
                    "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "username", user.getUsername(),
                        "role", user.getRole(),
                        "studentId", user.getStudent() != null ? user.getStudent().getId() : ""
                    )
                ));
            }
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid Credentials"));
    }
}