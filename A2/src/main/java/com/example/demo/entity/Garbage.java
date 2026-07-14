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
@Table(name = "Garbage")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Garbage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer garbageId;

	@Column(nullable = false, length = 20)
	private String garbageType;

	@Column(nullable = false, length = 20)
	private String cycle;

	@Column(nullable = false)
	private Integer garbage_day;

	private Integer userId;
}
