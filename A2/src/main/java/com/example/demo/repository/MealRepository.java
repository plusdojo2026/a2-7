package com.example.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Meal;

public interface MealRepository extends JpaRepository<Meal, Integer> {

	//ユーザーの食事情報の取得（一覧)
	Page<Meal>findByUserId(
			Integer userId,
			Pageable pageable);  //ページング条件
	
	//ユーザー(一覧)+朝昼晩
	Page<Meal>findByUserIdAndMealType(
			Integer userId, 
			String mealType,
			Pageable pageable);
}
