package com.example.hostel.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String name;

    // CHANGED: Replaced 'email' with 'username'
    // We will store the Roll Number here
    @NotBlank
    @Column(nullable = false, unique = true, length = 50)
    private String username; 

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 20)
    private String role; // "admin" or "student"

    @OneToOne // Changed to OneToOne usually makes sense for User-Student pair
    @JoinColumn(name = "student_id")
    private Student student; 

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
}