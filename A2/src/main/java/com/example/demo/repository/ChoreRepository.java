package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Chore;

public interface ChoreRepository extends JpaRepository<Chore, Integer> {

}