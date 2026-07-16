package com.example.demo.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Garbage;
import com.example.demo.repository.GarbageRepository;

@RestController
@RequestMapping("/api/garbage")
public class GarbageController {

	@Autowired
	private GarbageRepository garbageRepository;

	@PostMapping("/add")
	public Garbage addGarbage(@RequestBody Garbage garbage) {
		return garbageRepository.save(garbage);
	}

	@GetMapping
	public List<Garbage> getGarbage() {
		return garbageRepository.findAll();
	}
}