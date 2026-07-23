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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

        DailyItemMaster master = dailyItemMasterRepository
                .findById(dailyItemMasterId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "日用品マスターが見つかりません"
                        )
                );

        LocalDate today = LocalDate.now();

        DailyItemStock stock = new DailyItemStock();

        stock.setDailyItemStockName(
                master.getDailyItemMasterName()
        );

        stock.setCategory(master.getCategory());
        stock.setAddDate(today);

        stock.setGuideExDate(
                today.plusDays(
                        master.getGuideExpirationDays()
                )
        );

        stock.setStatus(true);

        return repository.save(stock);
    }

    //// 画像付きで日用品在庫を更新
    @PostMapping("/api/daily-item-stock/mod-image")
    public DailyItemStock modImage(
            @RequestPart("item") DailyItemStock item,
            @RequestPart(
                    value = "image",
                    required = false
            ) MultipartFile image
    ) throws IOException {

        // 新しい画像が選択された場合だけ保存
        if (image != null && !image.isEmpty()) {

            String fileName = saveImage(image);

            item.setDailyItemImage(fileName);
        }

        return repository.save(item);
    }
    
    /**
     * 画像をuploads/imagesに保存する
     */
    private String saveImage(MultipartFile image)
            throws IOException {

        // 元のファイル名を取得
        String originalName = image.getOriginalFilename();

        // 拡張子
        String extension = "";

        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(
                    originalName.lastIndexOf(".")
            );
        }

        // 重複しにくいファイル名を作成
        String fileName =
                UUID.randomUUID().toString() + extension;

        // 保存先フォルダ
        Path uploadDir = Paths.get("uploads");

        // フォルダがなければ作成
        Files.createDirectories(uploadDir);

        // 保存先
        Path savePath =
                uploadDir.resolve(fileName);

        // 画像を保存
        image.transferTo(savePath);

        return fileName;
    }
}