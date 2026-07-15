package com.example.demo.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.FoodMaster;
import com.example.demo.repository.FoodMasterRepository;

@RestController
@CrossOrigin
public class FoodMasterController {

	@Autowired
	FoodMasterRepository repository;
	
	@GetMapping("/api/food-master")
	public List<FoodMaster> findAll() {
		return repository.findAll();
    }
}
