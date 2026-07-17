package com.example.demo.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Garbage;
import com.example.demo.repository.GarbageRepository;

@RestController
@RequestMapping("/api/notice")
public class NoticeController {

    @Autowired
    private GarbageRepository garbageRepository;

    @GetMapping("/garbage")
    public List<Garbage> getGarbageNotice() {
        return garbageRepository.findByNotificationTrue(1);
    }
}