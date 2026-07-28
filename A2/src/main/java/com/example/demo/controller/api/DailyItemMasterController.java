package com.example.demo.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.DailyItemMaster;
import com.example.demo.repository.DailyItemMasterRepository;

@RestController
@RequestMapping("/api/daily-item-master")
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class DailyItemMasterController {

    @Autowired
    DailyItemMasterRepository repository;

    @GetMapping
    public List<DailyItemMaster> findAll() {
        return repository.findAll();
    }
}
