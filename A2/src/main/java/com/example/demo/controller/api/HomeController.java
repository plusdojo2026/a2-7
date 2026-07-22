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

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/home")
public class HomeController {

	@GetMapping("/point")
	public Integer getPoint(HttpSession session) {

		User user = (User) session.getAttribute("loginUser");

		if (user == null) {
			return 0;
		}

		return user.getPoint();
	}

	@Autowired
	private TipsRepository tipsRepository;

	@GetMapping("/tips")
	public Tips getRandomTips(HttpSession session) {

		LocalDate savedDate = (LocalDate) session.getAttribute("tipsDate");
		Tips savedTips = (Tips) session.getAttribute("todayTips");

		// 今日のTipsがセッションにあればそのまま返す
		if (savedDate != null && savedDate.equals(LocalDate.now()) && savedTips != null) {

			return savedTips;
		}

		List<Tips> tipsList = tipsRepository.findAll();

		if (tipsList.isEmpty()) {
			return null;
		}

		Random random = new Random();
		int index = random.nextInt(tipsList.size());

		Tips randomTips = tipsList.get(index);

		// 今日の日付とTipsをセッションに保存
		session.setAttribute("tipsDate", LocalDate.now());
		session.setAttribute("todayTips", randomTips);

		return randomTips;
	}
}