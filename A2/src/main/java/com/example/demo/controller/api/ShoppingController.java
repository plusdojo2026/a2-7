package com.example.demo.controller.api;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.ShoppingItem;
import com.example.demo.entity.ShoppingList;
import com.example.demo.repository.ShoppingItemRepository;
import com.example.demo.repository.ShoppingListRepository;

@RestController
@RequestMapping("/shopping")
public class ShoppingController {
	
	@Autowired
	private ShoppingListRepository shoppingListRepository;
	
	@Autowired
	private ShoppingItemRepository shoppingItemRepository;
	
	//買い物リスト一覧を取得
	@GetMapping("/list")
	public List<ShoppingList> getShoppingLists() {
		
		return shoppingListRepository.findAll();
	}
		
	@PostMapping
	public void saveshopping(@RequestBody List<ShoppingItem> items) {
		
		//新しい買い物リストの作成
		ShoppingList shoppingList = new ShoppingList();
		
		//日付をセット
		shoppingList.setCreateDate(LocalDate.now());
		shoppingList.setUser_id(1);
		
		//DBへ保存
		shoppingList = shoppingListRepository.save(shoppingList);
		
		//保存したIDをすべての商品にセット
		for (ShoppingItem item : items) {
			item.setShoppingListId(shoppingList.getShoppingListid());
		}
		
		//全部保存
		shoppingItemRepository.saveAll(items);
	
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
	public List<ShoppingItem> getLatestShoppingItems() {
		
		ShoppingList latest =
				shoppingListRepository.findTopByOrderByCreateDateDesc();
		
		if (latest == null) {
			return new ArrayList<>();
		}
		
		List<ShoppingItem> items = 
				shoppingItemRepository.findByShoppingListId(
						latest.getShoppingListid());
		
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

