package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Shopping;

public interface ShoppingRepository extends JpaRepository<Shopping, Integer> {

}
 