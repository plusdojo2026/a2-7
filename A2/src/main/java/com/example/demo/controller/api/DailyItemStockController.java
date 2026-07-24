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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.DailyItemMaster;
import com.example.demo.entity.DailyItemStock;
import com.example.demo.entity.User;
import com.example.demo.repository.DailyItemMasterRepository;
import com.example.demo.repository.DailyItemStockRepository;
import com.example.demo.repository.UserRepository;

@RestController
@CrossOrigin
public class DailyItemStockController {

    // 日用品在庫Repository
    @Autowired
    private DailyItemStockRepository repository;

    // 日用品マスターRepository
    @Autowired
    private DailyItemMasterRepository dailyItemMasterRepository;

    // ユーザーRepository
    @Autowired
    private UserRepository userRepository;

    //指定したユーザーの日用品在庫を取得する
    @GetMapping("/api/daily-item-stock/user/{userId}")
    public List<DailyItemStock> getByUserId(
            @PathVariable Integer userId
    ) {
        return repository.findByUserUserId(userId);
    }

    //日用品マスターから、指定したユーザーの在庫へ追加する
    @PostMapping(
        "/api/daily-item-stock/add-master/{dailyItemMasterId}/user/{userId}"
    )
    public DailyItemStock addFromMaster(
            @PathVariable Integer dailyItemMasterId,
            @PathVariable Integer userId
    ) {

        // 日用品マスターを取得
        DailyItemMaster master = dailyItemMasterRepository
                .findById(dailyItemMasterId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "日用品マスターが見つかりません"
                        )
                );

        // ユーザーを取得
        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "ユーザーが見つかりません"
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

        // マスターとの関連を保存
        stock.setDailyItemMaster(master);

        // ユーザーとの関連を保存
        stock.setUser(user);

        return repository.save(stock);
    }

    /**
     * 画像付きで日用品在庫を更新する
     */
    @PostMapping(
        "/api/daily-item-stock/mod-image/user/{userId}"
    )
    public DailyItemStock modImage(
            @PathVariable Integer userId,
            @RequestPart("item") DailyItemStock item,
            @RequestPart(
                    value = "image",
                    required = false
            ) MultipartFile image
    ) throws IOException {

        // 更新対象をデータベースから取得
        DailyItemStock savedItem = repository
                .findById(item.getDailyItemStockId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "日用品在庫が見つかりません"
                        )
                );

        // URLで指定されたユーザーのデータか確認
        if (
            savedItem.getUser() == null ||
            !savedItem.getUser()
                    .getUserId()
                    .equals(userId)
        ) {
            throw new RuntimeException(
                    "この日用品在庫を更新する権限がありません"
            );
        }

        // 入力された内容を更新
        savedItem.setDailyItemStockName(
                item.getDailyItemStockName()
        );
        savedItem.setCategory(item.getCategory());
        savedItem.setAddDate(item.getAddDate());
        savedItem.setGuideExDate(item.getGuideExDate());
        savedItem.setStatus(item.getStatus());

        // 新しい画像が選択された場合だけ保存
        if (image != null && !image.isEmpty()) {

            String fileName = saveImage(image);

            savedItem.setDailyItemImage(fileName);
        }

        return repository.save(savedItem);
    }

    //指定したユーザーの日用品在庫を削除する
    @DeleteMapping(
        "/api/daily-item-stock/{id}/user/{userId}"
    )
    public void delete(
            @PathVariable Integer id,
            @PathVariable Integer userId
    ) {

        DailyItemStock item = repository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "日用品在庫が見つかりません"
                        )
                );

        // 別ユーザーのデータを削除できないように確認する
        if (
            item.getUser() == null ||
            !item.getUser()
                    .getUserId()
                    .equals(userId)
        ) {
            throw new RuntimeException(
                    "この日用品在庫を削除する権限がありません"
            );
        }

        repository.delete(item);
    }

    /**
     * 画像をuploadsフォルダへ保存する
     */
    private String saveImage(
            MultipartFile image
    ) throws IOException {

        // 元のファイル名を取得
        String originalName = image.getOriginalFilename();

        // 拡張子
        String extension = "";

        if (
            originalName != null &&
            originalName.contains(".")
        ) {
            extension = originalName.substring(
                    originalName.lastIndexOf(".")
            );
        }

        // 重複しにくいファイル名を作成
        String fileName =
                UUID.randomUUID() + extension;

        // 保存先フォルダ
        Path uploadDir = Paths.get("uploads");

        // フォルダがなければ作成
        Files.createDirectories(uploadDir);

        // 保存先
        Path savePath = uploadDir.resolve(fileName);

        // 画像を保存
        image.transferTo(savePath);

        return fileName;
    }
}