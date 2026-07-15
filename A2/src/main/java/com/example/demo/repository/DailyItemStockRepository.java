package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.DailyItemStock;


public interface DailyItemStockRepository extends JpaRepository<DailyItemStock,Integer>{

	List<DailyItemStock> findByUserUserId(Integer userId);
}
