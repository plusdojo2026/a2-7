package com.example.demo.entity;

import java.time.LocalDateTime;

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
@Table(name = "chores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chore {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer choresId;

	@Column(nullable = false, length = 40)
	private String choresName;

	@Column(nullable = false, length = 20)
	private String priority;

	@Column(nullable = false)
	private Integer estimatedTime;

	@Column(nullable = false)
	private Integer point;

	private Boolean status;

	private LocalDateTime createdAt;
}