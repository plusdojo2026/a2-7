package com.example.demo.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/login")
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@PostMapping
	public boolean login(@RequestBody User user, HttpSession session) {

		User result = userRepository.findByUserIdAndPassword(user.getUserId(), user.getPassword());

		if (result != null) {

			// ログインユーザー保存
			session.setAttribute("loginUser", result);

			return true;
		}

		return false;
	}
}