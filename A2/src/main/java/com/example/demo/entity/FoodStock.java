package com.example.demo.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity              // データベースの1行と対になっていることを示す。
@AllArgsConstructor  // 全ての項目を引数として持つコンストラクタを自動定義する。
@NoArgsConstructor   // 引数なしのコンストラクタ自動で追加
@Data                // getter、setter、toStringなどの基本的メソッドを自動定義する。
@Table(name = "Stock_Food") // マッピングされるテーブルを指定する。
public class FoodStock {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer stockFoodId;
	private String stockFoodName;
	private String category;
	private LocalDate addDay;
	private LocalDate expirationDate;
	private Boolean status;
	
	@ManyToOne
	 @JoinColumn(name = "user_id")
	 @JsonIgnore
	private User user;
	@ManyToOne
	 @JoinColumn(name = "food_master_id")
	 @JsonIgnore
	private FoodMaster foodMaster;
}
