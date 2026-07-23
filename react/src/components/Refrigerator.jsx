import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../css/Refrigerator.css";
function Refrigerator() {
    //候補一覧のスクロール
    const foodCandidateListRef = useRef(null);
    const dailyCandidateListRef = useRef(null);
    // Spring Bootから取得した在庫
    // 在庫
    const [foods, setFoods] = useState([]);
    const [items, setItems] = useState([]);

    // マスター
    const [foodMasters, setFoodMasters] = useState([]);
    const [dailyItemMasters, setDailyItemMasters] = useState([]);

    // 現在表示しているタブ
    const [tab, setTab] = useState("food");

    //選択中の商品
    const [selectedItem, setSelectedItem] = useState(null);

    // 画面ロード時に食材と日用品を取得
    // 食材一覧を取得する
    const refreshFoods = () => {
        axios
            .get("http://localhost:8080/api/food_stock/")
            .then((res) => {
                setFoods(res.data);
            })
            .catch((error) => {
                console.error("食材の取得に失敗しました", error);
            });
    };
    const refreshFoodMasters = () => {
        axios
            .get("http://localhost:8080/api/food-master")
            .then((res) => {
                setFoodMasters(res.data);
            });
    };

    // 日用品一覧を取得する
    const refreshDailyItems = () => {
        axios
            .get("http://localhost:8080/api/daily-item-stock")
            .then((res) => {
                setItems(res.data);
            })
            .catch((error) => {
                console.error("日用品の取得に失敗しました", error);
            });
    };
    const refreshDailyItemMasters = () => {
        axios
            .get("http://localhost:8080/api/daily-item-master")
            .then((res) => {
                setDailyItemMasters(res.data);
            });
    };

    //最初に一覧を取得
    useEffect(() => {
        refreshFoods();
        refreshDailyItems();

        refreshFoodMasters();
        refreshDailyItemMasters();
    }, []);

    // 同じ名前の食材をまとめる
    const groupedFoods = Object.values(
        foods.reduce((groups, food) => {
            const key = food.foodStockName;

            if (!groups[key]) {
                groups[key] = {
                    foodStockName: food.foodStockName,
                    category: food.category,

                    // 在庫データにマスター情報が含まれている場合は画像名を取得
                    foodImg:
                        food.foodMaster?.foodImg ??
                        food.foodImg ??
                        `${food.foodStockName}.png`,

                    stocks: []
                };
            }

            groups[key].stocks.push(food);

            return groups;
        }, {})
    );

    // 同じ名前の日用品をまとめる
    const groupedItems = Object.values(
        items.reduce((groups, item) => {
            const key = item.dailyItemStockName;

            if (!groups[key]) {
                groups[key] = {
                    dailyItemStockName: item.dailyItemStockName,
                    category: item.category,

                    // 日用品マスターの画像名を取得
                    dailyItemImage:
                        item.dailyItemMaster?.dailyItemImage ??
                        item.dailyItemImage ??
                        `${item.dailyItemStockName}.png`,

                    stocks: []
                };
            }

            groups[key].stocks.push(item);

            return groups;
        }, {})
    );
    // 上段：冷蔵・飲料
    const topFoods = groupedFoods.filter((food) =>
        ["冷蔵", "飲料"].includes(food.category)
    );

    // 中段：野菜・常温・調味料・その他
    const middleFoods = groupedFoods.filter((food) =>
        ["野菜", "常温", "調味料", "その他"].includes(food.category)
    );

    // 下段：肉・魚・冷凍
    const bottomFoods = groupedFoods.filter((food) =>
        ["肉", "魚", "冷凍"].includes(food.category)
    );

    // どのカテゴリーにも当てはまらない食材
    const otherFoods = groupedFoods.filter((food) =>
        ![
            "冷蔵",
            "乳製品",
            "飲料",
            "飲み物",
            "野菜",
            "果物",
            "常温",
            "調味料",
            "肉",
            "魚",
            "冷凍",
            "冷凍食品"
        ].includes(food.category)
    );

    // 上段：生活用品
    const topDailyItems = groupedItems.filter(
        (item) => item.category === "生活用品"
    );

    // 中段：衛生用品
    const middleDailyItems = groupedItems.filter(
        (item) => item.category === "衛生用品"
    );

    // 下段：掃除用品
    const bottomDailyItems = groupedItems.filter(
        (item) => item.category === "掃除用品"
    );

    // その他
    const otherDailyItems = groupedItems.filter(
        (item) => item.category === "その他"
    );

    //クリックで在庫へ追加（食材）
    const addFoodByClick = (food) => {
        axios
            .post(
                `http://localhost:8080/api/food_stock/add-master/${food.foodMasterId}`
            )
            .then(() => {
                refreshFoods();
            })
            .catch((error) => {
                console.error("食材の追加に失敗しました", error);
            });
    };
    //クリックで在庫へ追加（日用品）
    const addDailyItemByClick = (item) => {
        axios
            .post(
                `http://localhost:8080/api/daily-item-stock/add-master/${item.dailyItemMasterId}`
            )
            .then(() => {
                refreshDailyItems();
            })
            .catch((error) => {
                console.error("日用品の追加に失敗しました", error);
            });
    };

    //削除
    // 選択した商品を1個削除する
    const deleteSelectedItem = () => {
        if (!selectedItem) {
            alert("削除する商品を選択してください。");
            return;
        }

        // 食材を1個削除
        if (selectedItem.type === "food") {
            const stocks = selectedItem.data.stocks;

            if (!stocks || stocks.length === 0) {
                return;
            }

            // 賞味期限が近い順に並べる
            const sortedStocks = [...stocks].sort((a, b) => {
                const dateA = a.expirationDate
                    ? new Date(a.expirationDate)
                    : new Date("9999-12-31");

                const dateB = b.expirationDate
                    ? new Date(b.expirationDate)
                    : new Date("9999-12-31");

                return dateA - dateB;
            });

            // 一番期限が近い食材
            const deleteTarget = sortedStocks[0];

            axios
                .post(
                    "http://localhost:8080/api/food_stock/del/",
                    deleteTarget
                )
                .then(() => {
                    setSelectedItem(null);
                    refreshFoods();
                })
                .catch((error) => {
                    console.error("食材の削除に失敗しました", error);
                });

            return;
        }

        // 日用品を1個削除
        if (selectedItem.type === "daily") {
            const stocks = selectedItem.data.stocks;

            if (!stocks || stocks.length === 0) {
                return;
            }

            // 使用期限が近い順に並べる
            const sortedStocks = [...stocks].sort((a, b) => {
                const dateA = a.guideExDate
                    ? new Date(a.guideExDate)
                    : new Date("9999-12-31");

                const dateB = b.guideExDate
                    ? new Date(b.guideExDate)
                    : new Date("9999-12-31");

                return dateA - dateB;
            });

            // 一番期限が近い日用品
            const deleteTarget = sortedStocks[0];

            axios
                .delete(
                    `http://localhost:8080/api/daily-item-stock/${deleteTarget.dailyItemStockId}`
                )
                .then(() => {
                    setSelectedItem(null);
                    refreshDailyItems();
                })
                .catch((error) => {
                    console.error("日用品の削除に失敗しました", error);
                });
        }
    };

    //候補一覧をスクロールさせるボタン
    const scrollCandidates = (listRef, direction) => {
        const list = listRef.current;

        if (!list) {
            return;
        }

        list.scrollBy({
            left: direction === "left" ? -180 : 180,
            behavior: "smooth"
        });
    };

    // まとめた食材を表示する
    const renderFood = (food, positionClass) => {
        const isSelected =
            selectedItem?.type === "food" &&
            selectedItem?.data.foodStockName === food.foodStockName;

        return (
            <div
                key={food.foodStockName}
                className={
                    isSelected
                        ? `stored-item ${positionClass} selected`
                        : `stored-item ${positionClass}`
                }
                onClick={() => {
                    setSelectedItem({
                        type: "food",
                        data: food
                    });
                }}
            >
                <div className="stored-image-wrapper">
                    <img
                        src={`/image/${food.foodImg}`}
                        alt={food.foodStockName}
                    />

                    <span className="stock-count">
                        ×{food.stocks.length}
                    </span>
                </div>

                <span className="stored-item-name">
                    {food.foodStockName}
                </span>
            </div>
        );
    };

    // まとめた日用品を表示する
    const renderDailyItem = (item, positionClass) => {
        const isSelected =
            selectedItem?.type === "daily" &&
            selectedItem?.data.dailyItemStockName ===
            item.dailyItemStockName;

        return (
            <div
                key={item.dailyItemStockName}
                className={
                    isSelected
                        ? `stored-item ${positionClass} selected`
                        : `stored-item ${positionClass}`
                }
                onClick={() => {
                    setSelectedItem({
                        type: "daily",
                        data: item
                    });
                }}
            >
                <div className="stored-image-wrapper">
                    <img
                        src={`/image/${item.dailyItemImage}`}
                        alt={item.dailyItemStockName}
                    />

                    <span className="stock-count">
                        ×{item.stocks.length}
                    </span>
                </div>

                <span className="stored-item-name">
                    {item.dailyItemStockName}
                </span>
            </div>
        );
    };

    return (
        <div className="stock-page">
            {/* 画面タイトル */}
            <h1 className="page-title">冷蔵庫・日用品</h1>

            <div className="stock-app">
                {/* タブ */}
                <div className="stock-tabs">
                    <button
                        type="button"
                        className={tab === "food" ? "tab-button active" : "tab-button"}
                        onClick={() => setTab("food")}
                    >
                        冷蔵庫
                    </button>

                    <button
                        type="button"
                        className={tab === "daily" ? "tab-button active" : "tab-button"}
                        onClick={() => setTab("daily")}
                    >
                        日用品倉庫
                    </button>
                </div>

                {/* 冷蔵庫画面 */}
                {tab === "food" && (
                    <>
                        <div
                            className="storage-area refrigerator-area"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                // 後で登録処理を書く
                            }}
                        >
                            {/* 冷蔵庫の棚 */}
                            <div className="shelf shelf-top" />
                            <div className="shelf shelf-middle" />
                            <div className="shelf shelf-bottom" />

                            {/* 登録済み食材 */}
                            <div className="stored-items">

                                {/* 上段 */}
                                {topFoods.map((food, index) =>
                                    renderFood(food, `food-top-${index % 3}`)
                                )}

                                {/* 中段 */}
                                {[...middleFoods, ...otherFoods].map((food, index) =>
                                    renderFood(food, `food-middle-${index % 3}`)
                                )}

                                {/* 下段 */}
                                {bottomFoods.map((food, index) =>
                                    renderFood(food, `food-bottom-${index % 3}`)
                                )}

                            </div>
                        </div>

                        {/* 食材用ゴミ箱 */}
                        <div
                            className="trash-area"
                            onClick={deleteSelectedItem}
                        >
                            🗑
                            <span>選択中の商品を1個削除</span>
                        </div>

                        <div className="candidate-area">

                            {/* 左へスクロール */}
                            <button
                                type="button"
                                className="candidate-scroll-button"
                                onClick={() =>
                                    scrollCandidates(foodCandidateListRef, "left")
                                }
                            >
                                ◀
                            </button>

                            {/* 食材の候補一覧 */}
                            <div
                                className="candidate-list"
                                ref={foodCandidateListRef}
                            >
                                {foodMasters.map((food) => (
                                    <div
                                        key={`candidate-${food.foodMasterId}`}
                                        className="candidate-item"
                                        draggable
                                        onClick={() => addFoodByClick(food)}
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData(
                                                "application/json",
                                                JSON.stringify({
                                                    type: "food",
                                                    data: food,
                                                })
                                            );
                                        }}
                                    >
                                        <img
                                            src={`/image/${food.foodImg}`}
                                            alt={food.foodName}
                                        />

                                        <span>{food.foodName}</span>
                                    </div>
                                ))}
                            </div>

                            {/* 右へスクロール */}
                            <button
                                type="button"
                                className="candidate-scroll-button"
                                onClick={() =>
                                    scrollCandidates(foodCandidateListRef, "right")
                                }
                            >
                                ▶
                            </button>

                        </div>
                    </>
                )}

                {/* 日用品倉庫画面 */}
                {tab === "daily" && (
                    <>
                        <div
                            className="storage-area warehouse-area"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                // 後で登録処理を書く
                            }}
                        >
                            {/* 倉庫の棚 */}
                            <div className="shelf shelf-top" />
                            <div className="shelf shelf-middle" />
                            <div className="shelf shelf-bottom" />

                            {/* 登録済み日用品 */}
                            <div className="stored-items">

                                {/* 上段 */}
                                {topDailyItems.map((item, index) =>
                                    renderDailyItem(item, `food-top-${index % 3}`)
                                )}

                                {/* 中段 */}
                                {middleDailyItems.map((item, index) =>
                                    renderDailyItem(item, `food-middle-${index % 3}`)
                                )}

                                {/* 下段 */}
                                {bottomDailyItems.map((item, index) =>
                                    renderDailyItem(item, `food-bottom-${index % 3}`)
                                )}

                                {/* その他は中段の空きへ表示 */}
                                {otherDailyItems.map((item, index) =>
                                    renderDailyItem(
                                        item,
                                        `food-middle-${(middleDailyItems.length + index) % 3}`
                                    )
                                )}

                            </div>
                        </div>

                        {/* 日用品用ゴミ箱 */}
                        <div
                            className="trash-area"
                            onClick={deleteSelectedItem}
                        >
                            🗑
                            <span>選択中の商品を1個削除</span>
                        </div>

                        {/* 登録候補の日用品一覧 */}
                        <div className="candidate-area">

                            {/* 左へスクロール */}
                            <button
                                className="candidate-scroll-button"
                                onClick={() =>
                                    scrollCandidates(dailyCandidateListRef, "left")
                                }
                            >
                                ◀
                            </button>

                            {/* 候補一覧 */}
                            <div
                                className="candidate-list"
                                ref={dailyCandidateListRef}
                            >
                                {dailyItemMasters.map((item) => (
                                    <div
                                        key={`candidate-${item.dailyItemMasterId}`}
                                        className="candidate-item"
                                        draggable
                                        onClick={() => addDailyItemByClick(item)}
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData(
                                                "application/json",
                                                JSON.stringify({
                                                    type: "daily",
                                                    data: item,
                                                })
                                            );
                                        }}
                                    >
                                        <img
                                            src={`/image/${item.dailyItemMasterName}.png`}
                                            alt={item.dailyItemMasterName}
                                        />

                                        <span>{item.dailyItemMasterName}</span>
                                    </div>
                                ))}
                            </div>

                            {/* 右へスクロール */}
                            <button
                                className="candidate-scroll-button"
                                onClick={() =>
                                    scrollCandidates(dailyCandidateListRef, "right")
                                }
                            >
                                ▶
                            </button>

                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Refrigerator;