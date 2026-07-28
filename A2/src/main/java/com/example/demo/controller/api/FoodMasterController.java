package com.example.demo.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.FoodMaster;
import com.example.demo.repository.FoodMasterRepository;

@RestController
@RequestMapping("/api/food-master")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class FoodMasterController {

    @Autowired
    FoodMasterRepository repository;

    @GetMapping
    public List<FoodMaster> findAll() {
        return repository.findAll();
    }
}
