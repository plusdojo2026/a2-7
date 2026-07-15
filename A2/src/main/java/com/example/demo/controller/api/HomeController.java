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
import com.example.demo.repository.GarbageRepository;
import com.example.demo.repository.TipsRepository;

@RestController
@RequestMapping("/api/home")
public class HomeController {

	@Autowired
	private GarbageRepository garbageRepository;

	@PostMapping("/garbage/add")
	public Garbage addGarbage(@RequestBody Garbage garbage) {
		return garbageRepository.save(garbage);
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
	
	@GetMapping("/tips")
	public String getRandomMusic() {

		List<Tips> tipsList = tipsRepository.findAll();

		if (tipsList.isEmpty()) {
			return null;
		}

		Random random = new Random();
		
		return tipsList.get(random.nextInt(tipsList.size())).getMusic();
	}
}