package com.example.demo.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.FoodStock;
import com.example.demo.repository.FoodStockRepository;

@RestController
@CrossOrigin
public class FoodStockController {

	@Autowired
	FoodStockRepository repository;
	
	@GetMapping("/api/food_stock/")
	public  List<FoodStock> get(){
		return repository.findAll();
	}
	
	@PostMapping("/api/food_stock/add/")
	public  FoodStock add(@RequestBody FoodStock foodstock) {
		repository.save(foodstock);
		return foodstock;
	}
	
	@PostMapping("/api/food_stock/mod/")
	public  FoodStock mod(@RequestBody FoodStock foodstock) {
		repository.save(foodstock);
		return foodstock;
	}
	
	@PostMapping("/api/food_stock/del/")
	public  FoodStock del(@RequestBody FoodStock foodstock) {
		repository.delete(foodstock);
		return foodstock;
	}
}
