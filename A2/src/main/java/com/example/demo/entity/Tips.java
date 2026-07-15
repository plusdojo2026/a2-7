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
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "Tips")
public class Tips {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer tipsId;
	@Column(nullable = false, length = 20)
	private String title;
	@Column(nullable = false, length = 200)
	private String tips;
	@Column(nullable = false, length = 50)
	private String music;
}
