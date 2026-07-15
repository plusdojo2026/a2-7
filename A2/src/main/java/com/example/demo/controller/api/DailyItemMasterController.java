package com.example.demo.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.DailyItemMaster;
import com.example.demo.repository.DailyItemMasterRepository;

@RestController
@CrossOrigin
public class DailyItemMasterController {

	@Autowired
    DailyItemMasterRepository repository;

    @GetMapping("/api/daily-item-master")
    public List<DailyItemMaster> findAll() {
        return repository.findAll();
    }
}
