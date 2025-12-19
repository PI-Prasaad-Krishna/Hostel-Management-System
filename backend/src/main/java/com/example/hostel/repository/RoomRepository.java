package com.example.hostel.repository;

import com.example.hostel.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    // Fetch rooms belonging to a specific hostel
    List<Room> findByHostel_Id(Long hostelId);
}
