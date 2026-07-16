-- ユーザー
INSERT INTO User (user_id, user_name, password, point) VALUES
(1, '田中太郎', 'pass1234', 0),
(2, '佐藤花子', 'user5678', 5),
(3, '鈴木一郎', 'home0001', 10),
(4, '高橋美咲', 'life2026', 20),
(5, '山本健太', 'test1234', 30);

-- 家事
INSERT INTO Chores
(chores_name, priority, estimated_time,
 created_at, point, status)
VALUES
('掃除機をかける', '高', 30, '2026-07-14 09:00:00', 30, FALSE),
('食器洗い', '中', 15, '2026-07-14 09:10:00', 15, TRUE),
('洗濯をする', '高', 60, '2026-07-14 09:20:00', 50, FALSE),
('ゴミ出し', '低', 10, '2026-07-14 09:30:00', 10, TRUE),
('お風呂掃除', '中', 20, '2026-07-14 09:40:00', 20, FALSE);

---- 食事
--INSERT INTO Meal
--(record_date, meal_type, meal_image, url, recipe_memo, recipe_title, user_id)
--VALUES
--('2026-07-14', '朝食', 'breakfast01.jpg', NULL, 'トーストはこんがり焼く', 'ベーコンエッグトースト', 1),
--
--('2026-07-14', '昼食', 'lunch01.jpg', NULL, '野菜を多めに入れた', 'チキンカレー', 1),
--
--('2026-07-14', '夕食', 'dinner01.jpg', NULL, '味噌を少し多めに入れた', 'サバの味噌煮', 2),
--
--('2026-07-15', '朝食', 'breakfast02.jpg', NULL, 'フルーツを添えて栄養バランスを意識', 'フルーツヨーグルト', 2),
--
--('2026-07-15', '夕食', 'dinner02.jpg', NULL, '家族に好評だったのでまた作りたい', 'ハンバーグ', 3);


-- 食材マスタ
INSERT INTO Food_Master (food_master_id, food_name, expiration_date, food_img) VALUES
(1, '卵', 14, NULL),
(2, '牛乳', 7, NULL),
(3, 'キャベツ', 14, NULL),
(4, '鶏むね肉', 2, NULL),
(5, 'にんじん', 21, NULL);

---- 食材在庫
--INSERT INTO Food_Stock
--(food_stock_id, food_stock_name, category, add_day, user_id, food_master_id, expiration_date, status)
--VALUES
--(1, '卵', '卵類', '2026-07-14', 1, 1, '2026-07-28', FALSE),
--(2, '牛乳', '乳製品', '2026-07-13', 1, 2, '2026-07-20', FALSE),
--(3, 'キャベツ', '野菜', '2026-07-12', 2, 3, '2026-07-26', TRUE),
--(4, '鶏むね肉', '肉類', '2026-07-14', 2, 4, '2026-07-16', FALSE),
--(5, 'にんじん', '野菜', '2026-07-10', 3, 5, '2026-07-31', FALSE);

-- 日用品マスタ
INSERT INTO Daily_Item_Master
(daily_item_master_id, daily_item_master_name, guide_ex_date, daily_item_image)
VALUES
(1, 'トイレットペーパー', '2026-10-14 00:00:00', NULL),
(2, 'ティッシュペーパー', '2026-09-14 00:00:00', NULL),
(3, '食器用洗剤', '2026-11-14 00:00:00', NULL),
(4, 'シャンプー', '2026-12-14 00:00:00', NULL),
(5, '歯磨き粉', '2027-01-14 00:00:00', NULL);

---- 日用品在庫
--INSERT INTO Daily_Item_Stock
--(daily_item_stock_id, daily_item_stock_name, category, guide_ex_date, add_date,
-- user_id, daily_item_master_id, status)
--VALUES
--(1, 'トイレットペーパー', '紙製品', '2026-10-14', '2026-07-14', 1, 1, FALSE),
--(2, 'ティッシュペーパー', '紙製品', '2026-09-14', '2026-07-12', 1, 2, FALSE),
--(3, '食器用洗剤', '洗剤', '2026-11-14', '2026-07-10', 2, 3, TRUE),
--(4, 'シャンプー', '衛生用品', '2026-12-14', '2026-07-13', 2, 4, FALSE),
--(5, '歯磨き粉', '衛生用品', '2027-01-14', '2026-07-11', 3, 5, FALSE);

---- 買い物
--INSERT INTO Shopping
--(shopping_name, is_bought, bought_day, user_id)
--VALUES
--('牛乳', FALSE, '2026-07-14', 1),
--('卵', TRUE, '2026-07-14', 1),
--('トイレットペーパー', FALSE, '2026-07-15', 2),
--('洗濯用洗剤', TRUE, '2026-07-15', 2),
--('キャベツ', FALSE, '2026-07-16', 3);

----ゴミ出し
--INSERT INTO Garbage
--(garbage_type, cycle, week_of_day, user_id)
--VALUES
--('燃えるゴミ', '毎週', 2, 1),
--('燃えるゴミ', '毎週', 5, 1),
--('資源ゴミ（缶・びん）', '毎月', 3, 1),
--('ペットボトル', '毎月', 4, 2),
--('燃えないゴミ', '毎月', 6, 3);

INSERT INTO Tips (title, tips, music)
VALUES
('重曹の活用方法',
 '重曹はキッチンの油汚れやシンクの掃除に使えます。水に溶かしてスプレーにすると便利です。',
 'Pretender'),

('洗濯のコツ',
 '洗濯物は詰め込みすぎず、適量で洗うと汚れが落ちやすくなります。',
 'Lemon'),

('冷蔵庫整理',
 '食材は賞味期限が近いものを手前に置くと、食品ロスを減らせます。',
 'マリーゴールド'),

('掃除の順番',
 '掃除は上から下へ行うと、ホコリが落ちても二度手間になりません。',
 'アイドル'),

('包丁のお手入れ',
 '包丁は使用後すぐに洗って乾燥させることで、サビや劣化を防げます。',
 'チェリー');