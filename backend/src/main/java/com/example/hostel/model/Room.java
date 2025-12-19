package com.example.hostel.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* =========================
       ROOM DETAILS
       ========================= */

    @Column(name = "room_number", nullable = false, length = 20)
    private String roomNumber;   // e.g. "101", "A-101"

    @Column
    private int floor;

    @Column
    private int capacity;

    @Column(name = "current_occupancy")
    private int currentOccupancy;

    /* =========================
       HOSTEL MAPPING
       ========================= */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hostel_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "rooms"})
    private Hostel hostel;

    /* =========================
       CONSTRUCTORS
       ========================= */

    public Room() {
        // Required by JPA
    }

    public Room(String roomNumber, int floor, int capacity, Hostel hostel) {
        this.roomNumber = roomNumber;
        this.floor = floor;
        this.capacity = capacity;
        this.hostel = hostel;
        this.currentOccupancy = 0;
    }

    /* =========================
       JSON HELPERS
       ========================= */

    // Expose hostelId safely for frontend (without full Hostel object)
    @JsonProperty("hostelId")
    public Long getHostelId() {
        return hostel != null ? hostel.getId() : null;
    }

    /* =========================
       GETTERS & SETTERS
       ========================= */

    public Long getId() {
        return id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
        this.floor = floor;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getCurrentOccupancy() {
        return currentOccupancy;
    }

    public void setCurrentOccupancy(int currentOccupancy) {
        this.currentOccupancy = currentOccupancy;
    }

    public Hostel getHostel() {
        return hostel;
    }

    public void setHostel(Hostel hostel) {
        this.hostel = hostel;
    }
}
