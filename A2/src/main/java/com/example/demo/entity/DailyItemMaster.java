package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "Daily_Item_Master")
public class DailyItemMaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dailyItemMasterId;

    private String dailyItemMasterName;

    private String category;

    // 登録日から交換目安までの日数
    private Integer guideExpirationDays;

    private String dailyItemImage;
}