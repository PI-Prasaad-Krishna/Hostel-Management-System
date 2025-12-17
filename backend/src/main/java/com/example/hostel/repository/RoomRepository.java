package com.example.hostel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hostel.model.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHostelId(Long hostelId);
}