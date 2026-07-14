package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity              // データベースの1行と対になっていることを示す。
@AllArgsConstructor  // 全ての項目を引数として持つコンストラクタを自動定義する。
@NoArgsConstructor   // 引数なしのコンストラクタ自動で追加
@Data                // getter、setter、toStringなどの基本的メソッドを自動定義する。
@Table(name = "Daily_Item_Master") // マッピングされるテーブルを指定する。
public class DailyItemMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer dailyItemMasterId;
	private String dailyItemMasterName;
	private LocalDateTime guideExDate; 
	private String dailyItemImage;
}
