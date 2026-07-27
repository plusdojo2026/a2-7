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
import com.example.demo.entity.User;
import com.example.demo.repository.DailyItemMasterRepository;
import com.example.demo.repository.DailyItemStockRepository;
import com.example.demo.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(
	    origins = "http://localhost:5173",
	    allowCredentials = "true"
	)
public class DailyItemStockController {

    // 日用品在庫Repository
    @Autowired
    private DailyItemStockRepository dailyItemStockRepository;

    // 日用品マスターRepository
    @Autowired
    private DailyItemMasterRepository dailyItemMasterRepository;

    // ユーザーRepository
    @Autowired
    private UserRepository userRepository;

    
   //セッションからログインユーザーを取得する処理
    private User getLoginUser(HttpSession session) {

        // セッションからログインユーザーを取得
        User loginUser =
            (User) session.getAttribute("loginUser");

        // ログインしていない場合
        if (loginUser == null) {
            throw new RuntimeException(
                "ログインしていません"
            );
        }

        // セッション内の情報ではなく、
        // DBから最新のユーザー情報を取得
        return userRepository
            .findById(loginUser.getUserId())
            .orElseThrow(
                () -> new RuntimeException(
                    "ログインユーザーが見つかりません"
                )
            );
    }

    
      //ログインユーザーの日用品在庫を取得
     
    @GetMapping("/api/daily-item-stock")
    public List<DailyItemStock> getDailyItemStock(
            HttpSession session) {

        // セッションからログインユーザーを取得
        User loginUser = getLoginUser(session);

        // ログインユーザーの日用品在庫だけを返す
        return dailyItemStockRepository
            .findByUserUserId(
                loginUser.getUserId()
            );
    }

    // 日用品マスターからログインユーザーの在庫へ追加
     
    @PostMapping(
        "/api/daily-item-stock/add-master/{dailyItemMasterId}"
    )
    public DailyItemStock addFromMaster(
            @PathVariable Integer dailyItemMasterId,
            HttpSession session) {

        // セッションからログインユーザーを取得
        User loginUser = getLoginUser(session);

        // 選択された日用品マスターを取得
        DailyItemMaster master =
            dailyItemMasterRepository
                .findById(dailyItemMasterId)
                .orElseThrow(
                    () -> new RuntimeException(
                        "日用品マスターが見つかりません"
                    )
                );

        // 交換目安日数が未設定の場合
        if (
            master.getGuideExpirationDays()
                == null
        ) {
            throw new RuntimeException(
                "交換目安日数が設定されていません"
            );
        }

        LocalDate today = LocalDate.now();

        DailyItemStock stock =
            new DailyItemStock();

        // マスター情報を在庫へコピー
        stock.setDailyItemStockName(
            master.getDailyItemMasterName()
        );

        stock.setCategory(
            master.getCategory()
        );

        stock.setAddDate(today);

        stock.setGuideExDate(
            today.plusDays(
                master.getGuideExpirationDays()
            )
        );

        stock.setStatus(true);

        // 日用品マスターと紐付ける
        stock.setDailyItemMaster(master);

        // ログインユーザーと紐付ける
        stock.setUser(loginUser);

        return dailyItemStockRepository
            .save(stock);
    }

    
      //ログインユーザーの日用品在庫を更新
     
    @PostMapping("/api/daily-item-stock/mod")
    public DailyItemStock update(
            @RequestBody DailyItemStock item,
            HttpSession session) {

        // セッションからログインユーザーを取得
        User loginUser = getLoginUser(session);

        // 更新対象をDBから取得
        DailyItemStock savedItem =
            dailyItemStockRepository
                .findById(
                    item.getDailyItemStockId()
                )
                .orElseThrow(
                    () -> new RuntimeException(
                        "日用品在庫が見つかりません"
                    )
                );

        // ログインユーザー本人の日用品か確認
        if (
            savedItem.getUser() == null ||
            !savedItem
                .getUser()
                .getUserId()
                .equals(loginUser.getUserId())
        ) {
            throw new RuntimeException(
                "この日用品在庫を更新する権限がありません"
            );
        }

        // 編集可能な項目だけ更新
        savedItem.setDailyItemStockName(
            item.getDailyItemStockName()
        );

        savedItem.setCategory(
            item.getCategory()
        );

        savedItem.setAddDate(
            item.getAddDate()
        );

        savedItem.setGuideExDate(
            item.getGuideExDate()
        );

        savedItem.setStatus(
            item.getStatus()
        );

        return dailyItemStockRepository
            .save(savedItem);
    }

    
     // ログインユーザーの日用品在庫を削除
     
    @DeleteMapping(
        "/api/daily-item-stock/{dailyItemStockId}"
    )
    public void delete(
            @PathVariable Integer dailyItemStockId,
            HttpSession session) {

        // セッションからログインユーザーを取得
        User loginUser = getLoginUser(session);

        // 削除対象をDBから取得
        DailyItemStock item =
            dailyItemStockRepository
                .findById(dailyItemStockId)
                .orElseThrow(
                    () -> new RuntimeException(
                        "日用品在庫が見つかりません"
                    )
                );

        // ログインユーザー本人の日用品か確認
        if (
            item.getUser() == null ||
            !item
                .getUser()
                .getUserId()
                .equals(loginUser.getUserId())
        ) {
            throw new RuntimeException(
                "この日用品在庫を削除する権限がありません"
            );
        }

        dailyItemStockRepository.delete(item);
    }
}