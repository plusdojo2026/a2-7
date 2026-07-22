package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Chore;

public interface ChoreRepository extends JpaRepository<Chore, Integer> {

	// status が指定値の家事を取得
	List<Chore> findByStatus(Boolean status);

	// 指定ユーザーの家事を全部取得
	List<Chore> findByUserId(Integer userId);

	// 指定ユーザーの、status が指定値の家事を取得(今日の家事)
	List<Chore> findByUserIdAndStatus(Integer userId, Boolean status);
}