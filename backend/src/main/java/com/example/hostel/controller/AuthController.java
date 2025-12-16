package com.example.hostel.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hostel.dto.LoginRequest;
import com.example.hostel.dto.LoginResponse;
import com.example.hostel.model.User;
import com.example.hostel.repository.UserRepository;
import com.example.hostel.service.JwtService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173/login") // Allows React to access this endpoint
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // 1. Find user (Fetching with student details if necessary)
        User user = userRepository.findByEmailWithStudent(request.getEmail())
                .orElse(null);

        // 2. Validate Password
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }

        // 3. Generate Token
        // Ensure user.getRole() is converted to String correctly if it's an Enum
        String token = jwtService.generateToken(user.getEmail(), String.valueOf(user.getRole()), user.getId());
        
        // 4. Create Flattened Response
        // We now pass fields directly to the constructor instead of creating a nested object
        LoginResponse response = new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                String.valueOf(user.getRole()) // Handles both String and Enum types safely
        );

        return ResponseEntity.ok(response);
    }
}