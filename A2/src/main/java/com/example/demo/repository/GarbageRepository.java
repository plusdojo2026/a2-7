package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Garbage;

public interface GarbageRepository extends JpaRepository<Garbage, Integer> {

}