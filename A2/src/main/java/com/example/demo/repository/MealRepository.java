package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Meal;

public interface MealRepository extends JpaRepository<Meal, Integer> {

	//ユーザーの食事情報の取得（一覧)
	List<Meal>findByUserId(Integer userId);
	
	//ユーザー(一覧)+朝昼晩
	List<Meal>findByUserIdAndMealType(Integer userId, String mealType);
}
