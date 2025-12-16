package com.example.hostel.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hostel.dto.StudentCreationResponse;
import com.example.hostel.dto.StudentRequest;
import com.example.hostel.model.Student;
import com.example.hostel.model.User;
import com.example.hostel.repository.StudentRepository;
import com.example.hostel.repository.UserRepository;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173") // <--- FIXED: Specific Origin (Crucial!)
public class StudentController {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentController(StudentRepository studentRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 1. GET ALL STUDENTS
    @GetMapping
    @Transactional(readOnly = true)
    public List<Student> getAll() {
        return studentRepository.findAll();
    }

    // 2. ADD NEW STUDENT (Merged Logic)
    @PostMapping
    @Transactional
    public ResponseEntity<StudentCreationResponse> create(@RequestBody StudentRequest request) {
        // A. Map Request DTO to Student Entity
        Student student = new Student();
        student.setName(request.getName());
        student.setRollNo(request.getRollNo());
        student.setDepartment(request.getDepartment());
        student.setGender(request.getGender());
        student.setContact(request.getContact());
        student.setGuardianName(request.getGuardianName());
        student.setGuardianPhone(request.getGuardianPhone());
        
        // Handle Year parsing (Frontend sends "1st Year", Backend likely wants Integer)
        try {
            String yearOnly = request.getYear().replaceAll("[^0-9]", ""); // Extracts "1"
            student.setYearOfStudy(Integer.parseInt(yearOnly));
        } catch (Exception e) {
            student.setYearOfStudy(1); // Default to 1st year if parsing fails
        }

        // B. Save Student First
        Student saved = studentRepository.save(student);
        studentRepository.flush();

        // C. Create User Account (Logic from your original file)
        String email = saved.getRollNo() != null && !saved.getRollNo().trim().isEmpty()
                ? saved.getRollNo().toLowerCase().replaceAll("\\s+", "") + "@hostel.com"
                : saved.getName().toLowerCase().replaceAll("\\s+", "") + saved.getId() + "@hostel.com";

        String defaultPassword = saved.getRollNo() != null && !saved.getRollNo().trim().isEmpty()
                ? saved.getRollNo()
                : "student123";

        // Check if user already exists
        if (userRepository.findByEmail(email).isEmpty()) {
            User user = new User();
            user.setName(saved.getName());
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(defaultPassword));
            user.setRole("STUDENT");
            user.setStudent(saved);

            userRepository.save(user);
            userRepository.flush();
        }

        // D. Return Response with generated credentials
        StudentCreationResponse response = new StudentCreationResponse(saved, email, defaultPassword);
        return ResponseEntity.ok(response);
    }

    // 3. GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getById(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. UPDATE STUDENT
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

    // 5. DELETE STUDENT
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