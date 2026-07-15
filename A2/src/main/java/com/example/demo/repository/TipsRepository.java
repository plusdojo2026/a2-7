package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Tips;

public interface TipsRepository extends JpaRepository<Tips, Integer> {
}
