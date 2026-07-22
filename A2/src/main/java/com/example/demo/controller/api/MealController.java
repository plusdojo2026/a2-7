package com.example.demo.controller.api;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.Meal;
import com.example.demo.repository.MealRepository;

@RestController
public class MealController {
	
	@Autowired
	private MealRepository repository;
	
	//食事内容の登録
	@PostMapping("/api/meal/regist/")
	private Meal regist(
			@RequestParam("image") MultipartFile image,
			@ModelAttribute Meal meal) { //JSONデータをオブジェクトに変換
		
		String fileName;
		
		try {
			fileName = saveImage(image); //以下の画像保存メソッドに移動
			meal.setMealImage(fileName);  //entityに値をセット
		
			Integer userId = 1;  //ログイン中のユーザーのｉｄ取得→１は仮置き
			meal.setUserId(userId);  //mealオブジェクトのuserIdに値をセット
			repository.save(meal);  //DB保存
			return meal;
		
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	
	//登録された画像ファイルをuploadsフォルダに保存
	private String saveImage(MultipartFile file) 
		throws IOException{
		String fileName =
				System.currentTimeMillis() + "_" + file.getOriginalFilename(); //現在時刻＋fileNameが取得してきた画像名に
		
		String uploadDir =
				System.getProperty("user.dir")  //プロジェクトの中にあるupladsフォルダの場所を作って、その住所をuplpadDirという変数に入れてる
				+ "\\uploads\\";
			
				System.out.println("保存先：" + uploadDir);
		
		File dir = new File(uploadDir); //upLoadsフォルダを表すオブジェクトを作る
		if(!dir.exists()) { //uploadsフォルダがない場合
			dir.mkdirs(); //フォルダ作る
			
		}
		File saveFile = new File(dir, fileName); //保存する画像のパスを作成
		file.transferTo(saveFile); //フォルダへ保存
		return fileName;  //fileName = saveImage(image)へ戻る
	}
	
	//食事内容の更新
	@PostMapping("/api/meal/update/")
	private Meal update(
			@RequestParam(value ="image", required=false) MultipartFile image,
			@ModelAttribute Meal meal) {
		try {
			
			if(image != null && !image.isEmpty()) {  //画像が空じゃない＝選択されていた時は更新！
				String fileName = saveImage(image); //以下の画像保存メソッドに移動
				meal.setMealImage(fileName);  //entityに値をセット
			}
			repository.save(meal);  //DB保存
			return meal;
		
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	
	//食事内容の一覧取得+記録日が新しい順古い順に切り替え
	@GetMapping("/api/meal/") 
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
	@GetMapping("/api/meal/type/") 
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
