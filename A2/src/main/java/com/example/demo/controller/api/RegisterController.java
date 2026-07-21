package com.example.demo.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/register")
public class RegisterController {

	@Autowired
	private UserRepository userRepository;

	@PostMapping
	public boolean register(@RequestBody User user) {

		if (user.getUser_name() == null || user.getUser_name().isEmpty() || user.getPassword() == null
				|| user.getPassword().isEmpty()) {

			return false;
		}

		if (userRepository.existsByUser_name(user.getUser_name())) {

			return false;
		}

		user.setPoint(0);

		userRepository.save(user);

		return true;
	}
}