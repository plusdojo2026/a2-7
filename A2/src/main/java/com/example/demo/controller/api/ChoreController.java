package com.example.demo.controller.api;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.ChoreMaster;
import com.example.demo.entity.User;
import com.example.demo.entity.UserChore;
import com.example.demo.repository.ChoreMasterRepository;
import com.example.demo.repository.UserChoreRepository;
import com.example.demo.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/chore")
public class ChoreController {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ChoreMasterRepository choreMasterRepository;

	@Autowired
	private UserChoreRepository userChoreRepository;

	/*
	 * 家事リスト取得 全ユーザー共通の家事一覧
	 */
	@GetMapping("/")
	public List<ChoreMaster> getChores() {

		return choreMasterRepository.findAll();

	}

	/*
	 * 今日の家事取得 status=trueのみ取得
	 */
	@GetMapping("/today")
	public List<UserChore> getTodayChores(HttpSession session) {

		User loginUser = (User) session.getAttribute("loginUser");

		if (loginUser == null) {
			return null;
		}

		// 今日の曜日
		// 0=月曜日 ～ 6=日曜日
		int today = java.time.LocalDate.now().getDayOfWeek().getValue() - 1;
		

		// status=trueのマイ家事取得
		List<UserChore> chores = userChoreRepository.findByUserIdAndStatus(loginUser.getUserId(), true);

		List<UserChore> todayChores = new java.util.ArrayList<>();

		for (UserChore chore : chores) {

			String frequency = chore.getFrequency();

			// 毎日
			if ("毎日".equals(frequency)) {

				todayChores.add(chore);

			}

			// 週1回
			else if ("週1回".equals(frequency)) {

				if (chore.getDay() != null) {

					int day = Integer.parseInt(chore.getDay());

					if (day == today) {
						todayChores.add(chore);
					}

				}

			}

			// 週2回
			else if ("週2回".equals(frequency)) {

				if (chore.getDay() != null) {

					String[] days = chore.getDay().split(",");

					for (String d : days) {

						int day = Integer.parseInt(d);

						if (day == today) {
							todayChores.add(chore);
							break;
						}

					}

				}

			}

		}

		return todayChores;
	}

	/*
	 * マイ家事登録 status=trueにする
	 */
	@PostMapping("/register/{id}")
	public UserChore registerChore(@PathVariable Integer id, HttpSession session) {

		User loginUser = (User) session.getAttribute("loginUser");

		if (loginUser == null) {
			return null;
		}

		// 家事マスタ取得
		ChoreMaster choreMaster = choreMasterRepository.findById(id).orElseThrow();

		/*
		 * すでに登録済みか確認
		 */
		UserChore userChore = userChoreRepository.findByUserIdAndChoreMaster_ChoreMasterId(loginUser.getUserId(), id);

		/*
		 * 初回登録の場合
		 */
		if (userChore == null) {

			userChore = new UserChore();

			userChore.setUserId(loginUser.getUserId());

			userChore.setChoreMaster(choreMaster);

			userChore.setFrequency(null);
			userChore.setDay(null);
		}

		// マイ家事ON
		userChore.setStatus(true);

		return userChoreRepository.save(userChore);

	}

	/*
	 * マイ家事解除 status=falseにする
	 */
	@PostMapping("/unregister/{id}")
	public UserChore unregisterChore(@PathVariable Integer id, HttpSession session) {

		User loginUser = (User) session.getAttribute("loginUser");

		if (loginUser == null) {
			return null;
		}

		UserChore userChore = userChoreRepository.findByUserIdAndChoreMaster_ChoreMasterId(loginUser.getUserId(), id);

		if (userChore == null) {
			return null;
		}

		// マイ家事OFF
		userChore.setStatus(false);

		return userChoreRepository.save(userChore);

	}

	/*
	 * ユーザーのマイ家事一覧取得
	 */
	@GetMapping("/my")
	public List<UserChore> getMyChores(HttpSession session) {

		User loginUser = (User) session.getAttribute("loginUser");

		if (loginUser == null) {
			return null;
		}

		return userChoreRepository.findByUserId(loginUser.getUserId());

	}

	/*
	 * 家事設定更新
	 */
	@PutMapping("/setting")
	public UserChore updateSetting(@RequestBody UserChore request, HttpSession session) {

		User loginUser = (User) session.getAttribute("loginUser");

		if (loginUser == null) {
			return null;
		}

		UserChore userChore = userChoreRepository.findByUserIdAndChoreMaster_ChoreMasterId(loginUser.getUserId(),
				request.getChoreMaster().getChoreMasterId());

		if (userChore == null) {
			return null;
		}

		userChore.setFrequency(request.getFrequency());
		userChore.setDay(request.getDay());

		return userChoreRepository.save(userChore);
	}
	/*
	 * ポイント加算
	 */
	@PostMapping("/point/{point}")
	public User addPoint(@PathVariable Integer point, HttpSession session) {

	    // セッションからログインユーザー取得
	    User loginUser = (User) session.getAttribute("loginUser");

	    if (loginUser == null) {
	        return null;
	    }

	    // 最新のユーザー情報取得
	    User user = userRepository.findById(loginUser.getUserId())
	            .orElseThrow();

	    // ポイント加算
	    user.setPoint(user.getPoint() + point);

	    // 保存
	    userRepository.save(user);

	    return user;
	}
	
	/*
	 * 家事完了
	 */
	@PostMapping("/done")
	public void doneChore(@RequestBody List<String> choreNames, HttpSession session) {

	    User loginUser = (User) session.getAttribute("loginUser");

	    if (loginUser == null) {
	        return;
	    }

	    for (String name : choreNames) {

	        UserChore userChore =
	                userChoreRepository.findByUserIdAndChoreMaster_ChoresName(
	                        loginUser.getUserId(),
	                        name);

	        if (userChore != null) {

	            userChore.setLastDoneDate(LocalDate.now());

	            userChoreRepository.save(userChore);

	        }
	    }
	}
}