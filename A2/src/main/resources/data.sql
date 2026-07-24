-- ユーザー
INSERT INTO Users (user_name, password, point)
VALUES
('tanaka', 'pass1234', 0),
('sato', 'user5678', 5),
('suzuki', 'home0001', 10),
('takahashi', 'life2026', 20),
('yamamoto', 'test1234', 30),
('ito', 'ito12345', 15),
('watanabe', 'watanabe01', 25),
('kobayashi', 'kobayashi8', 40),
('kato', 'kato2026', 35),
('yoshida', 'yoshida99', 55);

-- 家事マスタ
INSERT INTO chore_master
(chores_name, priority, estimated_time, point, category)
VALUES
('掃除機をかける', '高', 30, 30, '掃除'),
('食器洗い', '中', 15, 15, '洗い物'),
('洗濯をする', '高', 60, 50, '洗濯'),
('ゴミ出し', '低', 10, 10, '掃除'),
('お風呂掃除', '中', 20, 20, '掃除');
--ユーザー家事設定
INSERT INTO user_chore
(user_id, chore_master_id, status, frequency, day)
VALUES
(1, 1, TRUE, '週1回', '0'),
(1, 2, FALSE, '毎日', NULL),
(1, 3, TRUE, '週2回', '1,4'),
(1, 4, TRUE, '毎日', NULL),
(1, 5, FALSE, '週1回', '2');

-- 食事
INSERT INTO Meals
(record_date, meal_type, meal_image, url, recipe_memo, recipe_title, user_id)
VALUES
('2026-07-14', '朝食', NULL, 'https://example.com/recipe1', 'トーストはこんがり焼く', 'ハムエッグトースト', 1),
('2026-07-14', '昼食', NULL, 'https://example.com/recipe2', '野菜を多めに入れる', 'チキンサラダ', 1),
('2026-07-14', '夕食', NULL, 'https://example.com/recipe3', '弱火で20分煮込む', 'ビーフシチュー', 1),
('2026-07-15', '朝食', NULL, 'https://example.com/recipe4', 'バナナは最後に盛り付ける', 'フルーツヨーグルト', 2),
('2026-07-15', '昼食', NULL, 'https://example.com/recipe5', 'パスタはアルデンテに', 'ナポリタン', 2);

-- 食材マスター
INSERT INTO Food_Master
(food_name, category, expiration_date, food_img)
VALUES
('卵',       '冷蔵',   14, 'egg.png'),
('牛乳',     '冷蔵',    7, 'milk.png'),
('食パン',   '常温',    5, 'bread.png'),
('にんじん', '野菜',   14, 'carrot.png'),
('鶏むね肉', '肉',      3, 'chicken.png'),
('鮭',       '魚',      4, 'salmon.png'),
('冷凍うどん','冷凍', 180, 'udon.png'),
('醤油',     '調味料',365, 'soy_sauce.png'),
('オレンジジュース','飲料',30,'juice.png'),
('缶詰',     'その他',365, 'can.png');

-- 食材在庫
INSERT INTO Food_Stock
(food_stock_name, category, add_day, expiration_date, status, notice_read, user_id, food_master_id)
VALUES
('卵', '冷蔵', '2026-07-14', '2026-07-28', FALSE, FALSE, 1, 1),
('牛乳', '冷蔵', '2026-07-15', '2026-07-22', FALSE, FALSE, 1, 2),
('食パン', '常温', '2026-07-16', '2026-07-21', FALSE, FALSE, 2, 3),
('にんじん', '野菜', '2026-07-16', '2026-07-30', TRUE, FALSE, 2, 4),
('鶏むね肉', '肉', '2026-07-17', '2026-07-20', FALSE, FALSE, 1, 5),
('鮭', '魚', '2026-07-18', '2026-07-22', FALSE, FALSE, 1, 6),
('冷凍うどん', '冷凍', '2026-07-18', '2027-01-15', FALSE, FALSE, 2, 7),
('醤油', '調味料', '2026-07-10', '2027-07-10', FALSE, FALSE, 1, 8),
('オレンジジュース', '飲料', '2026-07-17', '2026-08-15', FALSE, FALSE, 2, 9),
('缶詰', 'その他', '2026-07-12', '2027-07-12', FALSE, FALSE, 1, 10);

-- 日用品マスタ
INSERT INTO Daily_Item_Master
(daily_item_master_name, category, guide_expiration_days, daily_item_image)
VALUES
('トイレットペーパー','生活用品',30,'toilet_paper.png'),
('ティッシュ','生活用品',20,'tissue.png'),
('歯磨き粉','衛生用品',90,'toothpaste.png'),
('シャンプー','衛生用品',120,'shampoo.png'),
('洗剤','掃除用品',180,'detergent.png'),
('電池','その他',365,'battery.png');

-- 日用品在庫
INSERT INTO Daily_Item_Stock
(daily_item_stock_name, category, guide_ex_date, add_date, status, user_id, daily_item_master_id)
VALUES
('トイレットペーパー', '生活用品', '2026-08-15', '2026-07-15', FALSE, 1, 1),
('ティッシュ', '生活用品', '2026-08-01', '2026-07-16', FALSE, 1, 2),
('歯磨き粉', '衛生用品', '2026-09-01', '2026-07-10', FALSE, 2, 3),
('シャンプー', '衛生用品', '2026-09-15', '2026-07-12', TRUE, 2, 4),
('洗剤', '掃除用品', '2026-10-01', '2026-07-18', FALSE, 1, 5);

--買い物リスト
INSERT INTO shopping_list
(create_date, user_id)
VALUES
('2026-07-14', 1),
('2026-07-15', 1),
('2026-07-16', 2),
('2026-07-17', 2),
('2026-07-18', 1);

-- 買い物リスト商品
INSERT INTO shopping_item
(shopping_list_id, item_name, is_bought)
VALUES
(1,'牛乳',0),
(1,'卵',0),
(1,'食パン',1),
(2,'洗剤',0),
(2,'トイレットペーパー',0),
(3,'シャンプー',1),
(3,'歯磨き粉',0),
(4,'鶏むね肉',0),
(4,'野菜',0),
(5,'調味料',1);

---- ゴミ出し設定
--INSERT INTO Garbage
--(garbage_type, cycle, garbage_day, user_id)
--VALUES
--('燃えるゴミ', '週2回', 1, 1),
--('燃えないゴミ', '月1回', 3, 1),
--('資源ゴミ', '隔週', 5, 1),
--('ペットボトル', '月2回', 2, 2),
--('缶・ビン', '月1回', 4, 2);

-- 豆知識
INSERT INTO Tips
(title, tips, music)
VALUES
('朝食を食べよう', '朝食を食べることで脳が活性化し、一日の集中力が高まります。', '朝の散歩'),
('水分補給', 'こまめな水分補給は熱中症や脱水症状の予防につながります。', '水の音'),
('適度な運動', '1日30分程度のウォーキングで健康維持が期待できます。', 'ランニングBGM'),
('十分な睡眠', '毎日6〜8時間の睡眠を心掛けると疲労回復につながります。', 'ヒーリングミュージック'),
('野菜を食べよう', '1日350gを目安に野菜を摂取すると栄養バランスが整います。', 'カフェBGM');
