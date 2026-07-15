package com.example.demo.controller.api;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ShoppingController {
	
	@GetMapping("/")
	public String Shopping (Model model)

}
