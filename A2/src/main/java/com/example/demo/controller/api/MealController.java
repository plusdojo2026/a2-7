package com.example.demo.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Meal;
import com.example.demo.repository.MealRepository;

@RestController
public class MealController {
	
	@Autowired
	private MealRepository repository;
	
	//食事内容の登録
	@PostMapping("/meal/register/")
	private Meal regist(@RequestBody Meal meal) { //JSONデータをオブジェクトに変換
		repository.save(meal);
		return meal;
	}
	
	//食事内容の一覧取得
	@GetMapping("/meal/") 
		List<Meal> get(){
		return repository.findByUserId();
	}
	

}
