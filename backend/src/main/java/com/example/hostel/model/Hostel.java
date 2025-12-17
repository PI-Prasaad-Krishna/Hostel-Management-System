package com.example.hostel.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "hostels")
public class Hostel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // "Mens Hostel Block A"
    private String type;        // "Mens" or "Ladies" or "Mixed"
    private String address;     
    private String wardenName;  // Who manages it
    private int capacity;       // Total beds available

    // --- RELATIONSHIP: One Hostel has Many Rooms ---
    // This allows us to delete a hostel and automatically delete its rooms
    @OneToMany(mappedBy = "hostel", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // Prevents infinite loops when fetching data
    private List<Room> rooms;

    // --- CONSTRUCTORS ---
    public Hostel() {}

    public Hostel(String name, String type, String address, String wardenName, int capacity) {
        this.name = name;
        this.type = type;
        this.address = address;
        this.wardenName = wardenName;
        this.capacity = capacity;
    }

    // --- GETTERS AND SETTERS (The Controller needs these!) ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; } // <--- Fixes the 'cannot find symbol' error

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getWardenName() { return wardenName; }
    public void setWardenName(String wardenName) { this.wardenName = wardenName; } // <--- Fixes the error

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; } // <--- Fixes the error

    public List<Room> getRooms() { return rooms; }
    public void setRooms(List<Room> rooms) { this.rooms = rooms; }
}