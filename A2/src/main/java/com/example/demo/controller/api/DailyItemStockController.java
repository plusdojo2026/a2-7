package com.example.demo.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.DailyItemStock;
import com.example.demo.repository.DailyItemStockRepository;

@RestController
@CrossOrigin
public class DailyItemStockController {

	@Autowired
    DailyItemStockRepository repository;

    @GetMapping("/api/daily-item-stock")
    public List<DailyItemStock> findAll() {
        return repository.findAll();
    }

    @PostMapping("/api/daily-item-stock")
    public DailyItemStock save(@RequestBody DailyItemStock item) {
        return repository.save(item);
    }

    @DeleteMapping("/api/daily-item-stock/{id}")
    public void delete(@PathVariable Integer id) {
        repository.deleteById(id);
    }
}
