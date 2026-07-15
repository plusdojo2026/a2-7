package com.example.demo.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Meal;
import com.example.demo.repository.MealRepository;

@RestController
public class MealController {
	
	@Autowired
	private MealRepository repository;
	
	//食事内容の登録
	@PostMapping("/meal/register/")
	private Meal regist(@RequestBody Meal meal) { //JSONデータをオブジェクトに変換
		Integer userId = 1;  //ログイン中のユーザーのｉｄ取得→１は仮置き
		meal.setUserId(userId);  //mealオブジェクトのuserIdに値をセット
		repository.save(meal);
		return meal;
	}
	
	//食事内容の一覧取得+記録日が新しい順古い順に切り替え
	@GetMapping("/meal/") 
	List<Meal> get(
					@RequestParam(defaultValue = "0") Integer page, //一覧表示のページデータを取得(使わないかも）
					@RequestParam(defaultValue="desc")String sort
				){
		Integer userId = 1;  //ログイン中のユーザーのｉｄ取得→１は仮置き
		Sort sortOrder;
		if(sort.equals("asc")) {
			sortOrder = Sort.by("recordDate").ascending();
		}else {
			sortOrder = Sort.by("recordDate").descending();
		}
		
		//ページング情報
		Pageable pageable=
				PageRequest.of(
						page, //何ページ目を取得するか
						30,//一ページ当たり３０件
						sortOrder //並び順
				);
		return repository.findByUserId(userId, pageable) //userIdが一致する食事記録の取得、ページングの条件
				 .getContent(); //Page<mear>をList<meal>に変換
	}
	
	
	//食事タイプ＋並び替え
	@GetMapping("/meal/type/") 
	List<Meal>getByType(
					@RequestParam String mealType,
					@RequestParam(defaultValue = "0") Integer page, //一覧表示のページデータを取得(使わないかも）
					@RequestParam(defaultValue="desc")String sort
				){
		Integer userId = 1;  //ログイン中のユーザーのｉｄ取得→１は仮置き
		Sort sortOrder;
		if(sort.equals("asc")) {
			sortOrder = Sort.by("recordDate").ascending();
		}else {
			sortOrder = Sort.by("recordDate").descending();
		}
		
		//ページング情報
		Pageable pageable=
				PageRequest.of(
						page, //何ページ目を取得するか
						30,//一ページ当たり３０件
						sortOrder //並び順
				);
		return repository.findByUserIdAndMealType(
							userId,
							mealType,
							pageable)
						 .getContent(); //Page<mear>をList<meal>に変換
	}
	

}
