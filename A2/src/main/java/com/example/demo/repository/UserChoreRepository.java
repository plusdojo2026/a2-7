package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.UserChore;

public interface UserChoreRepository extends JpaRepository<UserChore, Integer> {

	// ユーザーのマイ家事一覧取得
	List<UserChore> findByUserId(Integer userId);

	// 今日の家事取得(status=true)
	List<UserChore> findByUserIdAndStatus(Integer userId, Boolean status);

	// ユーザーID + 家事マスタIDで検索
	// 登録済みか確認するために使用
	UserChore findByUserIdAndChoreMaster_ChoreMasterId(Integer userId, Integer choreMasterId);
	// ユーザーIDと家事名で検索
	UserChore findByUserIdAndChoreMaster_ChoresName(Integer userId, String choresName);
}