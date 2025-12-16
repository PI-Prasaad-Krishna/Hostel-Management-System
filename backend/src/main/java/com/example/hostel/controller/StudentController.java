package com.example.hostel.controller;

import com.example.hostel.dto.StudentCreationResponse;
import com.example.hostel.model.Student;
import com.example.hostel.model.User;
import com.example.hostel.repository.StudentRepository;
import com.example.hostel.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentController(StudentRepository studentRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    @PostMapping
    @Transactional
    public ResponseEntity<StudentCreationResponse> create(@RequestBody Student student) {
        if (student == null || student.getName() == null || student.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Student name is required");
        }
        
        // Save student first
        Student saved = studentRepository.save(student);
        studentRepository.flush();
        
        // Create user account for the student
        // Generate email from roll number or use name
        String email = student.getRollNo() != null && !student.getRollNo().trim().isEmpty()
                ? student.getRollNo().toLowerCase().replaceAll("\\s+", "") + "@hostel.com"
                : student.getName().toLowerCase().replaceAll("\\s+", "") + saved.getId() + "@hostel.com";
        
        String defaultPassword = null;
        
        // Check if user already exists
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = new User();
            user.setName(student.getName());
            user.setEmail(email);
            // Default password: roll number or "student123"
            defaultPassword = student.getRollNo() != null && !student.getRollNo().trim().isEmpty()
                    ? student.getRollNo()
                    : "student123";
            user.setPassword(passwordEncoder.encode(defaultPassword));
            user.setRole("STUDENT");
            user.setStudent(saved);
            
            userRepository.save(user);
            userRepository.flush();
        } else {
            // User exists, get the password hint
            defaultPassword = student.getRollNo() != null && !student.getRollNo().trim().isEmpty()
                    ? student.getRollNo()
                    : "student123";
        }
        
        StudentCreationResponse response = new StudentCreationResponse(saved, email, defaultPassword);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getById(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<Student> update(@PathVariable Long id, @RequestBody Student student) {
        return studentRepository.findById(id)
                .map(existing -> {
                    if (student.getName() != null) existing.setName(student.getName());
                    if (student.getRollNo() != null) existing.setRollNo(student.getRollNo());
                    if (student.getDepartment() != null) existing.setDepartment(student.getDepartment());
                    if (student.getYearOfStudy() != null) existing.setYearOfStudy(student.getYearOfStudy());
                    if (student.getGender() != null) existing.setGender(student.getGender());
                    if (student.getContact() != null) existing.setContact(student.getContact());
                    if (student.getGuardianName() != null) existing.setGuardianName(student.getGuardianName());
                    if (student.getGuardianPhone() != null) existing.setGuardianPhone(student.getGuardianPhone());
                    if (student.getCurrentRoom() != null) existing.setCurrentRoom(student.getCurrentRoom());
                    if (student.getJoinDate() != null) existing.setJoinDate(student.getJoinDate());
                    if (student.getLeaveDate() != null) existing.setLeaveDate(student.getLeaveDate());
                    
                    Student updated = studentRepository.save(existing);
                    studentRepository.flush();
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            studentRepository.flush();
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

