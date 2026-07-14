package com.example.demo.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name="Meals") //Mealテーブルに対応するエンティティ
public class Meal {
	
	@Id  //主キー
	@GeneratedValue(strategy=GenerationType.IDENTITY)  //オートインクリメント
	private Integer meal_id; //食事ID
	private LocalDate record_date; //記録日
	private String meal_type; //区分
	@Lob
	private byte[] meal_image; //料理画像
	private String url; //URL
	private String recipe_memo; //レシピメモ
	private String recipe_title; //レシピ名
	private Integer user_id; //ユーザーID
	
	
}
