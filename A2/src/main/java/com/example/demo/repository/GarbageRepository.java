package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Garbage;

public interface GarbageRepository extends JpaRepository<Garbage, Integer> {
	List<Garbage> findByUserIdAndGarbageday(Integer user_id,Integer garbage_day);
}