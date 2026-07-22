package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Garbage;

public interface GarbageRepository extends JpaRepository<Garbage, Integer> {

	List<Garbage> findByUserIdAndGarbageDay(Integer userId, Integer garbageDay);

	List<Garbage> findByUserIdAndNotificationTrue(Integer userId);

	Optional<Garbage> findByUserIdAndGarbageType(Integer userId, String garbageType);
}