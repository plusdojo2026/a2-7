package com.example.demo.controller.api;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Tips;
import com.example.demo.entity.User;
import com.example.demo.repository.TipsRepository;
import com.example.demo.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/home")
public class HomeController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TipsRepository tipsRepository;


	// ログインユーザーのポイント取得
	@GetMapping("/point")
	public Integer getPoint(HttpSession session) {

		// セッションからログインユーザー取得
		User loginUser = (User) session.getAttribute("loginUser");

		if (loginUser == null) {
			return 0;
		}

		// DBから最新のユーザー情報を取得
		User user = userRepository.findById(loginUser.getUserId())
				.orElseThrow();

		// 最新ポイントを返す
		return user.getPoint();
	}


	// 今日のTips取得
	@GetMapping("/tips")
	public Tips getRandomTips(HttpSession session) {

		LocalDate savedDate = (LocalDate) session.getAttribute("tipsDate");
		Tips savedTips = (Tips) session.getAttribute("todayTips");


		// 今日のTipsがセッションにあればそのまま返す
		if (savedDate != null 
				&& savedDate.equals(LocalDate.now()) 
				&& savedTips != null) {

			return savedTips;
		}


		List<Tips> tipsList = tipsRepository.findAll();

		if (tipsList.isEmpty()) {
			return null;
		}


		Random random = new Random();
		int index = random.nextInt(tipsList.size());

		Tips randomTips = tipsList.get(index);


		// 今日の日付とTipsをセッション保存
		session.setAttribute("tipsDate", LocalDate.now());
		session.setAttribute("todayTips", randomTips);


		return randomTips;
	}
}