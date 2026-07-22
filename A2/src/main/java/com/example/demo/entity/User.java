package com.example.demo.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer userId;

	@NotBlank(message = "ユーザー名を入力してください")
	@Size(max = 20, message = "ユーザー名は20文字以内で入力してください")
	@Column(name = "user_name", length = 20)
	private String userName;

	@NotBlank(message = "パスワードを入力してください")
	@Size(min = 8, max = 20, message = "パスワードは8～20文字で入力してください")
	@Column(length = 20)
	private String password;

	private Integer point;
	
}