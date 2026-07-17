package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "shopping_item")
public class ShoppingItem {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "shopping_item_id")
	private Integer shoppingItemId;
	
	//どの買い物リストの商品か
	@Column(name = "shopping_list_id")
	private Integer shoppingListId;
	
	//商品名
	@Column(name = "item_name")
	private String itemName;
	
	//購入状況
	@Column(name = "is_bought")
	private Integer isBought;
	

}
