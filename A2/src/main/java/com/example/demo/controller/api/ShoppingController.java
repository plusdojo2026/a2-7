package com.example.demo.controller.api;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.ShoppingItem;
import com.example.demo.entity.ShoppingList;
import com.example.demo.entity.User;
import com.example.demo.repository.ShoppingItemRepository;
import com.example.demo.repository.ShoppingListRepository;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/shopping")
@CrossOrigin(origins = "http://localhost:5173",
		allowCredentials = "true")
public class ShoppingController {
	
	@Autowired
	private ShoppingListRepository shoppingListRepository;
	
	@Autowired
	private ShoppingItemRepository shoppingItemRepository;
	
	//買い物リスト一覧を取得
	@GetMapping("/list")
	public List<ShoppingList> getShoppingLists(HttpSession session) {
		
		//ログイン中のユーザーを取得
		User loginUser = (User) session.getAttribute("loginUser");
		
		//ログインしていなければ空を返す
		if(loginUser == null) {
			return new ArrayList<>();
		}
		
		//ログイン中のユーザーの買い物リストだけ取得
		List<ShoppingList> lists = shoppingListRepository.findByUserIdOrderByShoppingListidDesc(
				loginUser.getUserId());
		
		//１件ずつ取り出す
		for (ShoppingList list : lists) {
			
			//そのリストIDの商品を取得する
			List<ShoppingItem> items = 
					shoppingItemRepository.findByShoppingListId(
							list.getShoppingListid());
			
			list.setItems(items);
		}
	
		return lists;
	}
		
	@PostMapping
	public void saveshopping(@RequestBody List<ShoppingItem> items, HttpSession session) {
		
		//ログイン中のユーザーを取得
		User loginUser = (User) session.getAttribute("loginUser");
		System.out.println("loginUser = " + loginUser);
		
		if (loginUser == null) {
			return;
		}
		
		//新しい買い物リストの作成
		ShoppingList shoppingList = new ShoppingList();
		
		//日付をセット
		shoppingList.setCreateDate(LocalDate.now());
		
		//ログインユーザーのIDをセット
		shoppingList.setUserId(loginUser.getUserId());
		
		//DBへ保存
		shoppingList = shoppingListRepository.save(shoppingList);
		
		//保存したIDをすべての商品にセット
		for (ShoppingItem item : items) {
			item.setShoppingListId(shoppingList.getShoppingListid());
		}
		
		//全部保存
		shoppingItemRepository.saveAll(items);
		
		System.out.println("保存したID：" + shoppingList.getShoppingListid());
		System.out.println("ログインユーザー：" + loginUser.getUserId());
	
	}
	
	//商品の購入状況を更新
	@PutMapping("/item/{id}")
	public void updateShoppingItem(
			@PathVariable Integer id,
			@RequestBody ShoppingItem item) {
		
		ShoppingItem shoppingItem =
				shoppingItemRepository.findById(id).orElse(null);
		
		if(shoppingItem != null) {
			shoppingItem.setIsBought(item.getIsBought());
			shoppingItemRepository.save(shoppingItem);
		}
	}
	
	//最新リストの未購入商品を取得
	//latest==訳：最新の
	@GetMapping("/latest")
	public List<ShoppingItem> getLatestItems() {
		
		//最新の買い物リスト取得
		ShoppingList latestList =
				shoppingListRepository.findTopByOrderByShoppingListidDesc();
		
		if (latestList == null) {
			return new ArrayList<>();
		}
		
		//最新リストの商品を全部取得
		List<ShoppingItem> items = 
				shoppingItemRepository.findByShoppingListId(
						latestList.getShoppingListid());
		
		//未購入だけ入れる
		List<ShoppingItem> result = new ArrayList<>();
		
		for (ShoppingItem item : items) {
			
			if (item.getIsBought() == 0) {
				result.add(item);
			}
		}
		
		return result;
	}
	
	//モーダルに表示する商品一覧を取得
	@GetMapping("/item/{shoppingListId}")
	public List<ShoppingItem> getShoppingItems(
			@PathVariable Integer shoppingListId) {
		
		return shoppingItemRepository.findByShoppingListId(shoppingListId);
	}
}

