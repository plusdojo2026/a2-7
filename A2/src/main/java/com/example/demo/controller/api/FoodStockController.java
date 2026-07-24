package com.example.demo.controller.api;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.FoodMaster;
import com.example.demo.entity.FoodStock;
import com.example.demo.entity.User;
import com.example.demo.repository.FoodMasterRepository;
import com.example.demo.repository.FoodStockRepository;
import com.example.demo.repository.UserRepository;

@RestController
@CrossOrigin
public class FoodStockController {

	// 食材在庫Repository
	@Autowired
	private FoodStockRepository repository;

	// 食材マスターRepository
	@Autowired
	private FoodMasterRepository foodMasterRepository;

	// ユーザーRepository
	@Autowired
	private UserRepository userRepository;

	// 指定したユーザーの食材在庫を取得
	@GetMapping("/api/food_stock/user/{userId}")
	public List<FoodStock> getByUserId(@PathVariable Integer userId) {
		return repository.findByUserUserId(userId);
	}

	// 食材マスターから指定ユーザーの在庫へ追加
	@PostMapping("/api/food_stock/add-master/{foodMasterId}/user/{userId}")
	public FoodStock addFromMaster(@PathVariable Integer foodMasterId, @PathVariable Integer userId) {

		FoodMaster master = foodMasterRepository.findById(foodMasterId)
				.orElseThrow(() -> new RuntimeException("食材マスターが見つかりません"));

		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

		if (master.getExpirationDate() == null) {
			throw new RuntimeException("期限日数が設定されていません");
		}

		LocalDate today = LocalDate.now();

		FoodStock stock = new FoodStock();

		stock.setFoodStockName(master.getFoodName());
		stock.setCategory(master.getCategory());
		stock.setAddDay(today);

		stock.setExpirationDate(today.plusDays(master.getExpirationDate()));

		stock.setStatus(true);
		stock.setNoticeRead(false);

		// 食材マスターと紐付ける
		stock.setFoodMaster(master);

		// ユーザーと紐付ける
		stock.setUser(user);

		return repository.save(stock);
	}

	/*
	 * // 画像付きで食材在庫を更新
	 * 
	 * @PostMapping("/api/food_stock/mod-image/user/{userId}") public FoodStock
	 * modImage(@PathVariable Integer userId, @RequestPart("food") FoodStock
	 * foodStock,
	 * 
	 * @RequestPart(value = "image", required = false) MultipartFile image) throws
	 * IOException {
	 * 
	 * // 更新対象をDBから取得 FoodStock savedFood =
	 * repository.findById(foodStock.getFoodStockId()) .orElseThrow(() -> new
	 * RuntimeException("食材在庫が見つかりません"));
	 * 
	 * // 指定ユーザーのデータか確認 if (savedFood.getUser() == null ||
	 * !savedFood.getUser().getUserId().equals(userId)) { throw new
	 * RuntimeException("この食材在庫を更新する権限がありません"); }
	 * 
	 * // 編集可能な項目だけ更新 savedFood.setFoodStockName(foodStock.getFoodStockName());
	 * savedFood.setCategory(foodStock.getCategory());
	 * savedFood.setAddDay(foodStock.getAddDay());
	 * savedFood.setExpirationDate(foodStock.getExpirationDate());
	 * savedFood.setStatus(foodStock.getStatus());
	 * savedFood.setNoticeRead(foodStock.getNoticeRead());
	 * 
	 * // 新しい画像が選択された場合だけ保存 if (image != null && !image.isEmpty()) {
	 * 
	 * String fileName = saveImage(image);
	 * 
	 * savedFood.setFoodImage(fileName); }
	 * 
	 * return repository.save(savedFood); }
	 */

	// 指定ユーザーの食材在庫を削除
	@PostMapping("/api/food_stock/del/{foodStockId}/user/{userId}")
	public FoodStock delete(@PathVariable Integer foodStockId, @PathVariable Integer userId) {

		FoodStock foodStock = repository.findById(foodStockId).orElseThrow(() -> new RuntimeException("食材在庫が見つかりません"));

		// 別ユーザーのデータを削除できないように確認
		if (foodStock.getUser() == null || !foodStock.getUser().getUserId().equals(userId)) {
			throw new RuntimeException("この食材在庫を削除する権限がありません");
		}

		repository.delete(foodStock);

		return foodStock;
	}
	/*
	*//**
		 * 画像をuploadsフォルダへ保存する
		 *//*
			 * private String saveImage( MultipartFile image ) throws IOException {
			 * 
			 * String originalName = image.getOriginalFilename();
			 * 
			 * String extension = "";
			 * 
			 * if ( originalName != null && originalName.contains(".") ) { extension =
			 * originalName.substring( originalName.lastIndexOf(".") ); }
			 * 
			 * String fileName = UUID.randomUUID().toString() + extension;
			 * 
			 * Path uploadDir = Paths.get("uploads");
			 * 
			 * Files.createDirectories(uploadDir);
			 * 
			 * Path savePath = uploadDir.resolve(fileName);
			 * 
			 * image.transferTo(savePath);
			 * 
			 * return fileName; }
			 */
}