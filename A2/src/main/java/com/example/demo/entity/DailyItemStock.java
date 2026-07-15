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
@Table(name = "Daily_Item_Stock") // マッピングされるテーブルを指定する。
public class DailyItemStock {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer dailyItemStockId;
	private String dailyItemStockName;
	private String category;
	private LocalDate guideExDate;
	private LocalDate addDate;
	private Boolean status;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	@JsonIgnore
	private User user;
	@ManyToOne
	@JoinColumn(name = "daily_item_master_id")
	@JsonIgnore
	private DailyItemMaster dailyItemMaster;
}
