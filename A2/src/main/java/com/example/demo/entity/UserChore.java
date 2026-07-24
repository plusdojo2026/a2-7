package com.example.demo.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_chore")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserChore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userChoreId;


    // ユーザーID
    private Integer userId;


    // 家事マスタ
    @ManyToOne
    @JoinColumn(name = "chore_master_id")
    private ChoreMaster choreMaster;


    // マイ家事登録
    private Boolean status;


    // 頻度
    // 毎日 / 週1回 / 週2回
    private String frequency;


 // 曜日
 // 0=月曜日
 // 週2回の場合は "0,3" のように保存
 private String day;
 
//最後に家事を完了した日
private LocalDate lastDoneDate;
}