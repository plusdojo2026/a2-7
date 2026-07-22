package com.example.demo.controller.api;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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

        // IDを使ってFood_Masterから食材を取得
        FoodMaster master = foodMasterRepository
                .findById(foodMasterId)
                .orElseThrow(() ->
                        new RuntimeException("食材マスターが見つかりません")
                );

        LocalDate today = LocalDate.now();

        // Food_Stockへ登録するデータを作成
        FoodStock stock = new FoodStock();

        stock.setFoodStockName(master.getFoodName());
        stock.setCategory(master.getCategory());
        stock.setAddDay(today);

        // 今日の日付にマスターの期限日数を加算
        stock.setExpirationDate(
                today.plusDays(master.getExpirationDays())
        );

        stock.setStatus(true);

        return repository.save(stock);
    }
}