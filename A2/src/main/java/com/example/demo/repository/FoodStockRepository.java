package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.FoodStock;

public interface FoodStockRepository extends JpaRepository<FoodStock, Integer> {
	
	List<FoodStock> findByUserUserId(Integer userId);

}
