package com.example.demo.controller.api;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.DailyItemMaster;
import com.example.demo.entity.DailyItemStock;
import com.example.demo.repository.DailyItemMasterRepository;
import com.example.demo.repository.DailyItemStockRepository;

@RestController
@CrossOrigin
public class DailyItemStockController {

    // 日用品在庫Repository
    @Autowired
    private DailyItemStockRepository repository;

    // 日用品マスターRepository
    @Autowired
    private DailyItemMasterRepository dailyItemMasterRepository;

    // 日用品在庫一覧を取得
    @GetMapping("/api/daily-item-stock")
    public List<DailyItemStock> findAll() {
        return repository.findAll();
    }

    // 通常の日用品在庫追加・更新
    @PostMapping("/api/daily-item-stock")
    public DailyItemStock save(@RequestBody DailyItemStock item) {
        return repository.save(item);
    }

    // 日用品在庫を削除
    @DeleteMapping("/api/daily-item-stock/{id}")
    public void delete(@PathVariable Integer id) {
        repository.deleteById(id);
    }

    // 日用品マスターから在庫へ追加
    @PostMapping("/api/daily-item-stock/add-master/{dailyItemMasterId}")
    public DailyItemStock addFromMaster(
            @PathVariable Integer dailyItemMasterId
    ) {

        // IDを使ってDaily_Item_Masterから取得
        DailyItemMaster master = dailyItemMasterRepository
                .findById(dailyItemMasterId)
                .orElseThrow(() ->
                        new RuntimeException("日用品マスターが見つかりません")
                );

        LocalDate today = LocalDate.now();

        // Daily_Item_Stockへ登録するデータを作成
        DailyItemStock stock = new DailyItemStock();

        stock.setDailyItemStockName(
                master.getDailyItemMasterName()
        );

        stock.setCategory(master.getCategory());
        stock.setAddDate(today);

        // 今日の日付に交換目安日数を加算
        stock.setGuideExDate(
                today.plusDays(master.getGuideExpirationDays())
        );

        stock.setStatus(true);

        return repository.save(stock);
    }
}