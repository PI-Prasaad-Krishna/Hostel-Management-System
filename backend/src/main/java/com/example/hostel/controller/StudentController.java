package com.example.hostel.controller;

import com.example.hostel.model.Student;
import com.example.hostel.model.User;
import com.example.hostel.repository.StudentRepository;
import com.example.hostel.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public StudentController(StudentRepository studentRepository, UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> addStudent(@RequestBody Student student) {
        // 1. Check if Roll No already exists in Student Table
        if (studentRepository.existsByRollNo(student.getRollNo())) {
            return ResponseEntity.badRequest().body("Student with this Roll Number already exists!");
        }

        // 2. Check if Roll No already exists in User Table (Login Account)
        if (userRepository.existsByUsername(student.getRollNo())) {
            return ResponseEntity.badRequest().body("User account for this Roll Number already exists!");
        }

        // 3. Save the Student Profile
        Student savedStudent = studentRepository.save(student);

        // 4. AUTO-CREATE USER ACCOUNT
        User newUser = new User();
        newUser.setName(savedStudent.getName());
        
        // --- KEY CHANGE: Use Roll No as the Username ---
        newUser.setUsername(savedStudent.getRollNo()); 
        
        newUser.setPassword("password"); // Default password (changeable later)
        newUser.setRole("student");
        newUser.setStudent(savedStudent);
        
        userRepository.save(newUser);

        return ResponseEntity.ok(Map.of("message", "Student created! Login with Roll No: " + savedStudent.getRollNo()));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        return studentRepository.findById(id).map(student -> {
            // Delete the associated User account (search by RollNo/Username)
            userRepository.findByUsername(student.getRollNo())
                          .ifPresent(userRepository::delete);
            
            studentRepository.delete(student);
            return ResponseEntity.ok(Map.of("message", "Student and User deleted"));
        }).orElse(ResponseEntity.notFound().build());
    }
}