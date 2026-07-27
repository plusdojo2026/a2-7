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
import com.example.demo.entity.User;
import com.example.demo.repository.FoodMasterRepository;
import com.example.demo.repository.FoodStockRepository;
import com.example.demo.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@CrossOrigin(
    origins = "http://localhost:5173",
    allowCredentials = "true"
)
public class FoodStockController {

    // 食材在庫Repository
    @Autowired
    private FoodStockRepository foodStockRepository;

    // 食材マスターRepository
    @Autowired
    private FoodMasterRepository foodMasterRepository;

    // ユーザーRepository
    @Autowired
    private UserRepository userRepository;

    /**
     * セッションからログインユーザーを取得する共通処理
     */
    private User getLoginUser(HttpSession session) {

        User loginUser =
            (User) session.getAttribute("loginUser");

        if (loginUser == null) {
            throw new RuntimeException(
                "ログインしていません"
            );
        }

        // セッション内の情報ではなく、
        // DBから最新のユーザー情報を取得する
        return userRepository
            .findById(loginUser.getUserId())
            .orElseThrow(
                () -> new RuntimeException(
                    "ログインユーザーが見つかりません"
                )
            );
    }

    //ログインユーザーの食材在庫を取得
    @GetMapping("/api/food_stock")
    public List<FoodStock> getFoodStock( HttpSession session) {

        User loginUser = getLoginUser(session);

        return foodStockRepository.findByUserUserId(
                loginUser.getUserId()
            );
    }

    //食材マスターからログインユーザーの在庫へ追加
    @PostMapping(
        "/api/food_stock/add-master/{foodMasterId}"
    )
    public FoodStock addFromMaster(
            @PathVariable Integer foodMasterId,
            HttpSession session) {

        // セッションからログインユーザーを取得
        User loginUser = getLoginUser(session);

        // 選択された食材マスターを取得
        FoodMaster master =
            foodMasterRepository
                .findById(foodMasterId)
                .orElseThrow(
                    () -> new RuntimeException(
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

        // マスターの内容を在庫へコピー
        stock.setFoodStockName(
            master.getFoodName()
        );

        stock.setCategory(
            master.getCategory()
        );

        stock.setAddDay(today);

        stock.setExpirationDate(
            today.plusDays(
                master.getExpirationDate()
            )
        );

        stock.setStatus(true);
        stock.setNoticeRead(false);

        // 食材マスターと紐付ける
        stock.setFoodMaster(master);

        // ログインユーザーと紐付ける
        stock.setUser(loginUser);

        return foodStockRepository.save(stock);
    }

    // ログインユーザーの食材在庫を更新
    @PostMapping("/api/food_stock/mod")
    public FoodStock update(
            @RequestBody FoodStock foodStock,
            HttpSession session) {

        // セッションからログインユーザーを取得
        User loginUser = getLoginUser(session);

        // 更新対象をDBから取得
        FoodStock savedFood =
            foodStockRepository
                .findById(
                    foodStock.getFoodStockId()
                )
                .orElseThrow(
                    () -> new RuntimeException(
                        "食材在庫が見つかりません"
                    )
                );

        // ログインユーザー本人の在庫か確認
        if (
            savedFood.getUser() == null ||
            !savedFood
                .getUser()
                .getUserId()
                .equals(loginUser.getUserId())
        ) {
            throw new RuntimeException(
                "この食材在庫を更新する権限がありません"
            );
        }

        // 編集可能な項目だけ更新
        savedFood.setFoodStockName(
            foodStock.getFoodStockName()
        );

        savedFood.setCategory(
            foodStock.getCategory()
        );

        savedFood.setAddDay(
            foodStock.getAddDay()
        );

        savedFood.setExpirationDate(
            foodStock.getExpirationDate()
        );

        savedFood.setStatus(
            foodStock.getStatus()
        );

        savedFood.setNoticeRead(
            foodStock.getNoticeRead()
        );

        return foodStockRepository.save(savedFood);
    }

    //ログインユーザーの食材在庫を削除
     
    @PostMapping(
        "/api/food_stock/del/{foodStockId}"
    )
    public FoodStock delete(
            @PathVariable Integer foodStockId,
            HttpSession session) {

        // セッションからログインユーザーを取得
        User loginUser = getLoginUser(session);

        // 削除対象をDBから取得
        FoodStock foodStock =
            foodStockRepository
                .findById(foodStockId)
                .orElseThrow(
                    () -> new RuntimeException(
                        "食材在庫が見つかりません"
                    )
                );

        // ログインユーザー本人の在庫か確認
        if (
            foodStock.getUser() == null ||
            !foodStock
                .getUser()
                .getUserId()
                .equals(loginUser.getUserId())
        ) {
            throw new RuntimeException(
                "この食材在庫を削除する権限がありません"
            );
        }

        foodStockRepository.delete(foodStock);

        return foodStock;
    }
}