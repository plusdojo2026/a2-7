package com.example.demo.controller.api;

import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Garbage;
import com.example.demo.entity.Tips;
import com.example.demo.entity.User;
import com.example.demo.repository.GarbageRepository;
import com.example.demo.repository.TipsRepository;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/home")
public class HomeController {
	@Autowired
	private UserRepository userRepository;

	@GetMapping("/point")
	public Integer getPoint() {

		User user = userRepository.findById(1).orElse(null);

		return user.getPoint();
	}

	@Autowired
	private GarbageRepository garbageRepository;

	@PostMapping("/garbage/add")
	public Garbage addGarbage(@RequestBody Garbage garbage) {
		return garbageRepository.save(garbage);
	}

	@GetMapping("/garbage")
	public List<Garbage> getGarbage() {
		return garbageRepository.findAll();
	}

	@Autowired
	private TipsRepository tipsRepository;

	@GetMapping("/tips")
	public Tips getRandomTips() {

		List<Tips> tipsList = tipsRepository.findAll();

		if (tipsList.isEmpty()) {
			return null;
		}

		Random random = new Random();
		int index = random.nextInt(tipsList.size());

		return tipsList.get(index);
	}

}