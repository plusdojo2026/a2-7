package com.example.demo.entity;

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
@Table(name="Shopping")
public class Shopping {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer shopping_id;
	private String shopping_name;
	private Integer is_bought;
	private Integer bought_day;
	private Integer user_id;

}
