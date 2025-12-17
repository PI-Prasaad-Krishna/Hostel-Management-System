package com.example.hostel.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.hostel.model.User;
import com.example.hostel.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // CHANGED: Check by Username, not Email
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setUsername("admin"); // Login ID is just "admin"
            admin.setPassword("admin123"); // Default password
            admin.setRole("admin");
            
            userRepository.save(admin);
            System.out.println("Default Admin account created: username='admin', password='admin123'");
        }
    }
}