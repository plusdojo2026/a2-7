package com.example.demo.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name="shopping_list")
public class ShoppingList {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "shopping_list_id")
	private Integer shoppingListid;
	
	//リスト作成日
	@Column(name = "create_date")
	private LocalDate createDate;
	
	//ユーザーID
	private Integer user_id;
	
	@Transient
	private List<ShoppingItem> items;

}


