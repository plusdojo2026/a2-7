package com.example.demo.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Chore;
import com.example.demo.repository.ChoreRepository;

@RestController
@RequestMapping("/api/chore")
public class ChoreController {

	@Autowired
	private ChoreRepository choreRepository;

	// 家事の全件取得(家事リスト・家事提案の選択肢に使う)
	@GetMapping("/")
	public List<Chore> getChores() {
		return choreRepository.findAll();
	}

	// 今日の家事を取得(status=true のもの)
	@GetMapping("/today")
	public List<Chore> getTodayChores() {
		return choreRepository.findByStatus(true);
	}

	// 家事を今日の家事に追加する(status を true に更新)
	@PostMapping("/today/{id}")
	public Chore addToday(@PathVariable Integer id) {
		Chore chore = choreRepository.findById(id).orElseThrow();
		chore.setStatus(true);
		return choreRepository.save(chore);
	}

	// 家事の登録(初期データ投入や家事リストからの追加に使う)
	@PostMapping("/add")
	public Chore addChore(@RequestBody Chore chore) {
		return choreRepository.save(chore);
	}
}