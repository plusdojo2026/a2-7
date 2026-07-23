package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.ShoppingList;

public interface ShoppingListRepository extends JpaRepository<ShoppingList, Integer> {
	
	//新しい買い物リストを取得
	ShoppingList findTopByUserIdOrderByShoppingListidDesc(Integer userId);
	
	//本人のものか確認
	ShoppingList findByShoppingListid(Integer shoppingListid);

	List<ShoppingList> findByUserIdOrderByShoppingListidDesc(Integer userId);

}