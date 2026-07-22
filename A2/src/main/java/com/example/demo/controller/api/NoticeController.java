package com.example.demo.controller.api;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.FoodStock;
import com.example.demo.entity.Garbage;
import com.example.demo.entity.User;
import com.example.demo.repository.FoodStockRepository;
import com.example.demo.repository.GarbageRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/notice")
public class NoticeController {

	@Autowired
	private GarbageRepository garbageRepository;
	@Autowired
	private FoodStockRepository foodStockRepository;

	@GetMapping("/garbage")
	public List<Garbage> getGarbageNotice(HttpSession session) {
		User user = (User) session.getAttribute("loginUser");

		return garbageRepository.findByUserIdAndNotificationTrue(user.getUserId());
	}

	@GetMapping("/food")
	public List<FoodStock> getFoodNotice(HttpSession session) {
		User user = (User) session.getAttribute("loginUser");
		List<FoodStock> foods = foodStockRepository.findByUserUserId(user.getUserId());

		for (FoodStock food : foods) {

			LocalDate expiration = food.getAddDay().plusDays(food.getFoodMaster().getExpirationDate());

			// FoodStockのexpirationDateにセット
			food.setExpirationDate(expiration);
		}

		// 賞味期限が近い順に並び替え
		foods.sort(Comparator.comparing(FoodStock::getExpirationDate));

		return foods;
	}

	@PutMapping("/food/read/{id}")
	public void readFood(@PathVariable Integer id, HttpSession session) {

		User user = (User) session.getAttribute("loginUser");

		FoodStock food = foodStockRepository.findById(id).orElseThrow();

		if (!food.getUser().getUserId().equals(user.getUserId())) {
			return;
		}

		food.setNoticeRead(true);

		foodStockRepository.save(food);
	}
}