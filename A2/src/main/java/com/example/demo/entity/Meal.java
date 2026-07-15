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
	
	//もしかしたら@columnが必要かも（→データベース名と違うから）
	@Id  //主キー
	@GeneratedValue(strategy=GenerationType.IDENTITY)  //オートインクリメント
	private Integer mealId; //食事ID
	private LocalDate recordDate; //記録日
	private String mealType; //区分
	@Lob
	private byte[] mealImage; //料理画像→画像じゃなくて、ファイル名にする？
	private String url; //URL
	private String recipeMemo; //レシピメモ
	private String recipeTitle; //レシピ名
	private Integer userId; //ユーザーID
	
	
}
