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
@Table(name = "chore_master")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChoreMaster {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer choreMasterId;

	// 家事名
	@Column(nullable = false, length = 40)
	private String choresName;

	// 優先度
	@Column(nullable = false, length = 20)
	private String priority;

	// 所要時間
	@Column(nullable = false)
	private Integer estimatedTime;

	// 獲得ポイント
	@Column(nullable = false)
	private Integer point;

	// カテゴリ
	// 掃除 / 洗い物 / 洗濯
	@Column(length = 20)
	private String category;

}