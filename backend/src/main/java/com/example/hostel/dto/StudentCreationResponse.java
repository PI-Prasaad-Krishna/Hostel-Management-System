package com.example.hostel.dto;

import com.example.hostel.model.Student;

public class StudentCreationResponse {
    private Student student;
    private String email;
    private String password;

    public StudentCreationResponse(Student student, String email, String password) {
        this.student = student;
        this.email = email;
        this.password = password;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

