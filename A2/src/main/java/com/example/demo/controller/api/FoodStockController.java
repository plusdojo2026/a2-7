package com.example.demo.controller.api;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.FoodMaster;
import com.example.demo.entity.FoodStock;
import com.example.demo.repository.FoodMasterRepository;
import com.example.demo.repository.FoodStockRepository;

@RestController
@CrossOrigin
public class FoodStockController {

    // 食材在庫Repository
    @Autowired
    private FoodStockRepository repository;

    // 食材マスターRepository
    @Autowired
    private FoodMasterRepository foodMasterRepository;

    // 在庫一覧を取得
    @GetMapping("/api/food_stock/")
    public List<FoodStock> get() {
        return repository.findAll();
    }

    // 通常の在庫追加
    @PostMapping("/api/food_stock/add/")
    public FoodStock add(@RequestBody FoodStock foodStock) {
        return repository.save(foodStock);
    }

    // 在庫更新
    @PostMapping("/api/food_stock/mod/")
    public FoodStock mod(@RequestBody FoodStock foodStock) {
        return repository.save(foodStock);
    }

    // 在庫削除
    @PostMapping("/api/food_stock/del/")
    public FoodStock del(@RequestBody FoodStock foodStock) {
        repository.delete(foodStock);
        return foodStock;
    }

    // 食材マスターから在庫へ追加
    @PostMapping("/api/food_stock/add-master/{foodMasterId}")
    public FoodStock addFromMaster(
            @PathVariable Integer foodMasterId
    ) {

        FoodMaster master = foodMasterRepository
                .findById(foodMasterId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "食材マスターが見つかりません"
                        )
                );

        if (master.getExpirationDate() == null) {
            throw new RuntimeException(
                    "期限日数が設定されていません"
            );
        }

        LocalDate today = LocalDate.now();

        FoodStock stock = new FoodStock();

        stock.setFoodStockName(master.getFoodName());
        stock.setCategory(master.getCategory());
        stock.setAddDay(today);

        stock.setExpirationDate(
                today.plusDays(master.getExpirationDate())
        );

        stock.setStatus(true);
        stock.setNoticeRead(false);
        stock.setFoodMaster(master);

        return repository.save(stock);
    }

    // 画像付きで食材在庫を更新
    @PostMapping("/api/food_stock/mod-image")
    public FoodStock modImage(
            @RequestPart("food") FoodStock foodStock,
            @RequestPart(
                    value = "image",
                    required = false
            ) MultipartFile image
    ) throws IOException {

        // 新しい画像が選択された場合だけ保存
        if (image != null && !image.isEmpty()) {

            String fileName = saveImage(image);

            foodStock.setFoodImage(fileName);
        }

        return repository.save(foodStock);
    }

    /**
     * 画像をuploads/imagesに保存する
     */
    private String saveImage(MultipartFile image)
            throws IOException {

        String originalName =
                image.getOriginalFilename();

        String extension = "";

        if (
            originalName != null &&
            originalName.contains(".")
        ) {
            extension = originalName.substring(
                    originalName.lastIndexOf(".")
            );
        }

        String fileName =
                UUID.randomUUID().toString() + extension;

        Path uploadDir = Paths.get("uploads");

        Files.createDirectories(uploadDir);

        Path savePath =
                uploadDir.resolve(fileName);

        image.transferTo(savePath);

        return fileName;
    }
}