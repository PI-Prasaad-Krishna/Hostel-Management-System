package com.example.hostel.dto;

public class HostelRequest {
    private String name;        // e.g., "Mens Hostel Block A"
    private String type;        // "Mens" or "Ladies"
    private String address;     // Location info
    private String wardenName;  // Who is in charge?
    private Integer totalFloors;
    private Integer roomsPerFloor;

    // Default Constructor
    public HostelRequest() {}

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getWardenName() { return wardenName; }
    public void setWardenName(String wardenName) { this.wardenName = wardenName; }

    public Integer getTotalFloors() { return totalFloors; }
    public void setTotalFloors(Integer totalFloors) { this.totalFloors = totalFloors; }

    public Integer getRoomsPerFloor() { return roomsPerFloor; }
    public void setRoomsPerFloor(Integer roomsPerFloor) { this.roomsPerFloor = roomsPerFloor; }
}