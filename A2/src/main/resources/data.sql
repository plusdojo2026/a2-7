-- ユーザー
INSERT INTO User (user_name, password, point)
VALUES
('田中太郎', 'pass1234', '0'),
('佐藤花子', 'user5678', '5'),
('鈴木一郎', 'home0001', '10'),
('高橋美咲', 'life2026', '20'),
('山本健太', 'test1234', '30');

-- 家事
INSERT INTO chores
(chores_name, priority, estimated_time, point, status, created_at)
VALUES
('掃除機をかける', '高', 30, 30, FALSE, '2026-07-14 09:00:00'),
('食器洗い', '中', 15, 15, TRUE, '2026-07-14 09:10:00'),
('洗濯をする', '高', 60, 50, FALSE, '2026-07-14 09:20:00'),
('ゴミ出し', '低', 10, 10, TRUE, '2026-07-14 09:30:00'),
('お風呂掃除', '中', 20, 20, FALSE, '2026-07-14 09:40:00');

---- 食事
--INSERT INTO Meals
--(record_date, meal_type, meal_image, url, recipe_memo, recipe_title, user_id)
--VALUES
--('2026-07-14', '朝食', NULL, 'https://example.com/recipe1', 'トーストはこんがり焼く', 'ハムエッグトースト', 1),
--('2026-07-14', '昼食', NULL, 'https://example.com/recipe2', '野菜を多めに入れる', 'チキンサラダ', 1),
--('2026-07-14', '夕食', NULL, 'https://example.com/recipe3', '弱火で20分煮込む', 'ビーフシチュー', 1),
--('2026-07-15', '朝食', NULL, 'https://example.com/recipe4', 'バナナは最後に盛り付ける', 'フルーツヨーグルト', 2),
--('2026-07-15', '昼食', NULL, 'https://example.com/recipe5', 'パスタはアルデンテに', 'ナポリタン', 2);

-- 豆知識
INSERT INTO Tips
(title, tips, music)
VALUES
('朝食を食べよう', '朝食を食べることで脳が活性化し、一日の集中力が高まります。', '朝の散歩'),
('水分補給', 'こまめな水分補給は熱中症や脱水症状の予防につながります。', '水の音'),
('適度な運動', '1日30分程度のウォーキングで健康維持が期待できます。', 'ランニングBGM'),
('十分な睡眠', '毎日6〜8時間の睡眠を心掛けると疲労回復につながります。', 'ヒーリングミュージック'),
('野菜を食べよう', '1日350gを目安に野菜を摂取すると栄養バランスが整います。', 'カフェBGM');
