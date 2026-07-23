package com.example.demo.controller.api;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Chore;
import com.example.demo.entity.User;
import com.example.demo.repository.ChoreRepository;
import com.example.demo.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/chore")
public class ChoreController {

	@Autowired
	private ChoreRepository choreRepository;

	@Autowired
	private UserRepository userRepository;

	// ログイン中のユーザーの家事一覧を取得
	@GetMapping("/")
	public List<Chore> getChores(HttpSession session) {
		User loginUser = (User) session.getAttribute("loginUser");
		if (loginUser == null) {
			System.out.println("★未ログインです");
			return null;
		}
		System.out.println("★ログイン中のユーザーID: " + loginUser.getUserId());
		List<Chore> list = choreRepository.findByUserId(loginUser.getUserId());
		System.out.println("★取得した家事の件数: " + list.size());
		return list;
	}

	// ログイン中のユーザーの「今日の家事」を取得(status=true)
	@GetMapping("/today")
	public List<Chore> getTodayChores(HttpSession session) {
		User loginUser = (User) session.getAttribute("loginUser");
		if (loginUser == null) {
			return null;
		}
		return choreRepository.findByUserIdAndStatus(loginUser.getUserId(), true);
	}

	// 家事提案:指定した所要時間内でできる家事をランダムで返す
	@GetMapping("/suggest/{time}")
	public List<Chore> getSuggestChores(@PathVariable Integer time, HttpSession session) {
		User loginUser = (User) session.getAttribute("loginUser");
		if (loginUser == null) {
			return null;
		}

		// ログインユーザーの家事だけを対象にする
		List<Chore> choreList = choreRepository.findByUserId(loginUser.getUserId());
		if (choreList.isEmpty()) {
			return null;
		}

		// 順番をシャッフルする
		List<Chore> shuffled = new ArrayList<>(choreList);
		Collections.shuffle(shuffled);

		// 制限時間内に収まるものだけ順に詰める
		List<Chore> suggestList = new ArrayList<>();
		int total = 0;
		for (Chore chore : shuffled) {
			if (total + chore.getEstimatedTime() <= time) {
				suggestList.add(chore);
				total += chore.getEstimatedTime();
			}
		}
		return suggestList;
	}

	// 家事を「今日の家事」に追加する(status を true に更新)
	@PostMapping("/today/{id}")
	public Chore addToday(@PathVariable Integer id) {
		Chore chore = choreRepository.findById(id).orElseThrow();
		chore.setStatus(true);
		return choreRepository.save(chore);
	}

	// 家事の登録
	@PostMapping("/add")
	public Chore addChore(@RequestBody Chore chore) {
		return choreRepository.save(chore);
	}

	// ポイントを加算する(家事完了時に呼ぶ)
	@PostMapping("/point/{addPoint}")
	public User addPoint(@PathVariable Integer addPoint, HttpSession session) {
		User loginUser = (User) session.getAttribute("loginUser");
		if (loginUser == null) {
			return null;
		}
		// 最新のユーザー情報をDBから取り直す
		User user = userRepository.findById(loginUser.getUserId()).orElseThrow();
		// 今のポイントに加算する
		user.setPoint(user.getPoint() + addPoint);
		return userRepository.save(user);
	}
}