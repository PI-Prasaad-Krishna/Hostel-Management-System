package com.example.hostel.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* =========================
       BASIC DETAILS
       ========================= */

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "roll_no", length = 50)
    private String rollNo;

    @Column(length = 100)
    private String department;

    @Column(name = "year_of_study")
    private Integer yearOfStudy;

    @Column(length = 10)
    private String gender;

    @Column(length = 50)
    private String contact;

    /* =========================
       GUARDIAN DETAILS
       ========================= */

    @Column(name = "guardian_name", length = 120)
    private String guardianName;

    @Column(name = "guardian_phone", length = 50)
    private String guardianPhone;

    /* =========================
       STATUS & DATES
       ========================= */

    @Column(length = 20)
    private String status;

    @Column(name = "join_date")
    private LocalDate joinDate;

    @Column(name = "leave_date")
    private LocalDate leaveDate;

    /* =========================
       ROOM MAPPING
       ========================= */

    // Object reference (read-only)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_room_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "students"})
    private Room currentRoom;

    // Foreign key control (write-friendly)
    @Column(name = "current_room_id")
    private Long currentRoomId;

    /* =========================
       LIFECYCLE HOOKS
       ========================= */

    @PrePersist
    public void onCreate() {
        if (this.status == null) {
            this.status = "IN";
        }
    }

    /* =========================
       CONSTRUCTORS
       ========================= */

    public Student() {
        // Required by JPA
    }

    /* =========================
       GETTERS & SETTERS
       ========================= */

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRollNo() {
        return rollNo;
    }

    public void setRollNo(String rollNo) {
        this.rollNo = rollNo;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(Integer yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getGuardianName() {
        return guardianName;
    }

    public void setGuardianName(String guardianName) {
        this.guardianName = guardianName;
    }

    public String getGuardianPhone() {
        return guardianPhone;
    }

    public void setGuardianPhone(String guardianPhone) {
        this.guardianPhone = guardianPhone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getJoinDate() {
        return joinDate;
    }

    public void setJoinDate(LocalDate joinDate) {
        this.joinDate = joinDate;
    }

    public LocalDate getLeaveDate() {
        return leaveDate;
    }

    public void setLeaveDate(LocalDate leaveDate) {
        this.leaveDate = leaveDate;
    }

    public Room getCurrentRoom() {
        return currentRoom;
    }

    public Long getCurrentRoomId() {
        return currentRoomId;
    }

    public void setCurrentRoomId(Long currentRoomId) {
        this.currentRoomId = currentRoomId;
    }
}
