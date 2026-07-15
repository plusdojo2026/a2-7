package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.ShoppingItem;

public interface ShoppingItemRepository extends JpaRepository<ShoppingItem, Integer> {
	
	//指定したリストの商品一覧を取得
	List<ShoppingItem> findByShoppingListId(Integer shoppingListId);

}
