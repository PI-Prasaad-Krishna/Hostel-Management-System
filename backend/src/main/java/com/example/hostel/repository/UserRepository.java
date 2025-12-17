package com.example.hostel.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hostel.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // Find user by their Roll No (stored as username)
    Optional<User> findByUsername(String username);
    
    // Helper to check if username exists
    boolean existsByUsername(String username);
}