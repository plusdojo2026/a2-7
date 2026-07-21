package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
	 User findByUserIdAndPassword(Integer userId, String password);
	 boolean existsByUser_name(String user_name);
}
