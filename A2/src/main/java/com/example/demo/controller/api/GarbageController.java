package com.example.demo.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Garbage;
import com.example.demo.entity.User;
import com.example.demo.repository.GarbageRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/garbage")
public class GarbageController {

	@Autowired
	private GarbageRepository garbageRepository;

//	@PostMapping("/add")
//	public Garbage addGarbage(@RequestBody Garbage garbage) {
//		return garbageRepository.save(garbage);
//	}

	@GetMapping
	public List<Garbage> getGarbage() {
		return garbageRepository.findAll();
	}

	@PostMapping("/save")
	public Garbage saveGarbage(@RequestBody Garbage garbage, HttpSession session) {

		User user = (User) session.getAttribute("loginUser");
		if (user == null) {
			throw new RuntimeException("ログインしてください");
		}

		garbage.setUserId(user.getUserId());

		Garbage existing = garbageRepository.findByUserIdAndGarbageType(garbage.getUserId(), garbage.getGarbageType())
				.orElse(null);

		if (existing != null) {

			existing.setGarbageDay(garbage.getGarbageDay());
			existing.setNotification(garbage.getNotification());

			return garbageRepository.save(existing);

		} else {

			return garbageRepository.save(garbage);
		}
	}
}