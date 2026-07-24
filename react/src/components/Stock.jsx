import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Stock.css";

const Stock = () => {
    // 仮ログインユーザー
    const LOGIN_USER_ID = 1;

    // Spring Bootから取得した在庫
    const [foods, setFoods] = useState([]);
    const [dailyItems, setDailyItems] = useState([]);

    // 現在表示しているタブ
    const [tab, setTab] = useState("food");

    // API通信に失敗した場合のメッセージ
    const [errorMessage, setErrorMessage] = useState("");

    // 編集モーダルへ表示する食材
    const [modFood, setModFood] = useState({
        foodStockId: 0,
        foodStockName: "",
        category: "",
        addDay: "",
        expirationDate: "",
        status: true
    });

    // 編集モーダルへ表示する日用品
    const [modDailyItem, setModDailyItem] = useState({
        dailyItemStockId: 0,
        dailyItemStockName: "",
        category: "",
        addDate: "",
        guideExDate: "",
        status: true
    });

    // モーダルの表示状態
    const [showModal, setShowModal] = useState(false);

    // food または daily
    const [editType, setEditType] = useState("");

    // 食材カテゴリー画像
    const foodCategoryImages = {
        冷蔵: "/img/reizou.png",
        飲料: "/img/innryou.png",
        野菜: "/img/yasai.png",
        常温: "/img/jouonn.png",
        調味料: "/img/tyoumiryou.png",
        肉: "/img/niku.png",
        魚: "/img/sakana.png",
        冷凍: "/img/reitou.png",
        その他: "/img/sonota_syokuzai.png"
    };

    // 日用品カテゴリー画像
    const dailyCategoryImages = {
        生活用品: "/img/seikatuyouhinn.png",
        衛生用品: "/img/eiseiyouhinn.png",
        掃除用品: "/img/soujiyouhinn.png",
        その他: "/img/sonota_nitiyouhinn.png"
    };

    // 食材在庫を取得
    const refreshFoodStockList = () => {
        axios
            .get(
                `http://localhost:8080/api/food_stock/user/${LOGIN_USER_ID}`
            )
            .then((response) => {
                setFoods(response.data);
            })
            .catch((error) => {
                console.error("食材在庫の取得に失敗しました", error);
                setErrorMessage("食材在庫を取得できませんでした。");
            });
    };

    // 日用品在庫を取得
    const refreshDailyItemStockList = () => {
        axios
            .get(
                `http://localhost:8080/api/daily-item-stock/user/${LOGIN_USER_ID}`
            )
            .then((response) => {
                setDailyItems(response.data);
            })
            .catch((error) => {
                console.error("日用品在庫の取得に失敗しました", error);
                setErrorMessage("日用品在庫を取得できませんでした。");
            });
    };

    // 食材と日用品をまとめて再取得
    const refreshStockList = () => {
        setErrorMessage("");
        refreshFoodStockList();
        refreshDailyItemStockList();
    };

    // 初回表示時に在庫を取得
    useEffect(() => {
        refreshStockList();
    }, []);

    // 日付を「yyyy/mm/dd」に整える
    const formatDate = (dateText) => {
        if (!dateText) {
            return "未設定";
        }

        return String(dateText)
            .slice(0, 10)
            .replaceAll("-", "/");
    };

    // 今日から指定日までの残り日数を計算
    const getRemainingDays = (dateText) => {
        if (!dateText) {
            return null;
        }

        const dateParts = String(dateText)
            .slice(0, 10)
            .split("-");

        const year = Number(dateParts[0]);
        const month = Number(dateParts[1]);
        const day = Number(dateParts[2]);

        if (!year || !month || !day) {
            return null;
        }

        const now = new Date();

        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        const targetDate = new Date(
            year,
            month - 1,
            day
        );

        return Math.round(
            (targetDate - today) /
            (1000 * 60 * 60 * 24)
        );
    };

    // 残り日数を画面表示用の文字に変換
    const formatRemainingDays = (dateText) => {
        const remainingDays =
            getRemainingDays(dateText);

        if (remainingDays === null) {
            return "未設定";
        }

        if (remainingDays < 0) {
            return `${Math.abs(remainingDays)}日経過`;
        }

        if (remainingDays === 0) {
            return "今日";
        }

        return `残り${remainingDays}日`;
    };

    // 表示中タブの期限警告を作成
    const getExpirationAlerts = () => {
        const alerts = [];

        if (tab === "food") {
            foods.forEach((food) => {
                const remainingDays =
                    getRemainingDays(food.expirationDate);

                if (
                    remainingDays !== null &&
                    remainingDays <= 3
                ) {
                    if (remainingDays < 0) {
                        alerts.push(
                            `${food.foodStockName}の賞味期限が切れています。`
                        );
                    } else if (remainingDays === 0) {
                        alerts.push(
                            `${food.foodStockName}の賞味期限は今日です。`
                        );
                    } else {
                        alerts.push(
                            `${food.foodStockName}の賞味期限が残り${remainingDays}日です。`
                        );
                    }
                }
            });
        }

        if (tab === "daily") {
            dailyItems.forEach((item) => {
                const remainingDays =
                    getRemainingDays(item.guideExDate);

                if (
                    remainingDays !== null &&
                    remainingDays <= 3
                ) {
                    if (remainingDays < 0) {
                        alerts.push(
                            `${item.dailyItemStockName}の交換目安日が切れています。`
                        );
                    } else if (remainingDays === 0) {
                        alerts.push(
                            `${item.dailyItemStockName}の交換目安日は今日です。`
                        );
                    } else {
                        alerts.push(
                            `${item.dailyItemStockName}の交換目安日が残り${remainingDays}日です。`
                        );
                    }
                }
            });
        }

        return alerts;
    };

    const expirationAlerts =
        getExpirationAlerts();

    // 食材フォームの入力内容をStateへ保存
    const inputModFood = (event) => {
        const inputValue =
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value;

        setModFood({
            ...modFood,
            [event.target.name]: inputValue
        });
    };

    // 日用品フォームの入力内容をStateへ保存
    const inputModDailyItem = (event) => {
        const inputValue =
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value;

        setModDailyItem({
            ...modDailyItem,
            [event.target.name]: inputValue
        });
    };

    // 食材編集を開始
    const modFoodStart = (food) => {
        setModFood({
            foodStockId: food.foodStockId,
            foodStockName: food.foodStockName ?? "",
            category: food.category ?? "",
            addDay: food.addDay
                ? String(food.addDay).slice(0, 10)
                : "",
            expirationDate: food.expirationDate
                ? String(food.expirationDate).slice(0, 10)
                : "",
            status: food.status ?? true
        });

        setEditType("food");
        setErrorMessage("");
        setShowModal(true);
    };

    // 日用品編集を開始
    const modDailyItemStart = (item) => {
        setModDailyItem({
            dailyItemStockId:
                item.dailyItemStockId,
            dailyItemStockName:
                item.dailyItemStockName ?? "",
            category: item.category ?? "",
            addDate: item.addDate
                ? String(item.addDate).slice(0, 10)
                : "",
            guideExDate: item.guideExDate
                ? String(item.guideExDate).slice(0, 10)
                : "",
            status: item.status ?? true
        });

        setEditType("daily");
        setErrorMessage("");
        setShowModal(true);
    };

    // モーダルを閉じる
    const closeModal = () => {
        setShowModal(false);
        setEditType("");
    };

    // 在庫を更新
    const updateStock = () => {
        setErrorMessage("");

        if (editType === "food") {
            axios
                .post(
                    `http://localhost:8080/api/food_stock/mod/user/${LOGIN_USER_ID}`,
                    modFood
                )
                .then(() => {
                    refreshFoodStockList();
                    closeModal();
                })
                .catch((error) => {
                    console.error(
                        "食材在庫の更新に失敗しました",
                        error
                    );

                    setErrorMessage(
                        "食材在庫を更新できませんでした。"
                    );
                });

            return;
        }

        if (editType === "daily") {
            axios
                .post(
                    `http://localhost:8080/api/daily-item-stock/mod/user/${LOGIN_USER_ID}`,
                    modDailyItem
                )
                .then(() => {
                    refreshDailyItemStockList();
                    closeModal();
                })
                .catch((error) => {
                    console.error(
                        "日用品在庫の更新に失敗しました",
                        error
                    );

                    setErrorMessage(
                        "日用品在庫を更新できませんでした。"
                    );
                });
        }
    };

    return (
        <div className="stock-list-page">
            <section
                className="stock-list-app"
                aria-label="在庫一覧"
            >
                {/* 食材一覧・日用品一覧のタブ */}
                <div
                    className="stock-list-tabs"
                    role="tablist"
                >
                    <button
                        type="button"
                        role="tab"
                        aria-selected={tab === "food"}
                        className={
                            tab === "food"
                                ? "stock-list-tab active"
                                : "stock-list-tab"
                        }
                        onClick={() => setTab("food")}
                    >
                        食材一覧
                    </button>

                    <button
                        type="button"
                        role="tab"
                        aria-selected={tab === "daily"}
                        className={
                            tab === "daily"
                                ? "stock-list-tab active"
                                : "stock-list-tab"
                        }
                        onClick={() => setTab("daily")}
                    >
                        日用品一覧
                    </button>
                </div>

                <div className="stock-list-content">
                    {/* 期限警告 */}
                    {expirationAlerts.length > 0 && (
                        <div
                            className="expiration-alert"
                            role="status"
                        >
                            {expirationAlerts.map(
                                (alert, index) => (
                                    <div
                                        key={index}
                                        className="expiration-alert-item"
                                    >
                                        <span
                                            className="expiration-alert-dot"
                                            aria-hidden="true"
                                        />

                                        <span>{alert}</span>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {/* APIエラー */}
                    {errorMessage && (
                        <div
                            className="stock-list-error"
                            role="alert"
                        >
                            <p>{errorMessage}</p>

                            <button
                                type="button"
                                onClick={refreshStockList}
                            >
                                もう一度読み込む
                            </button>
                        </div>
                    )}

                    {/* 食材一覧 */}
                    {tab === "food" && (
                        <>
                            {foods.length === 0 &&
                                !errorMessage && (
                                    <p className="stock-list-message">
                                        登録されている食材はありません。
                                    </p>
                                )}

                            {foods.length > 0 && (
                                <ul className="stock-list-items">
                                    {foods.map(
                                        (food, index) => (
                                            <li
                                                className="stock-list-row"
                                                key={
                                                    food.foodStockId ??
                                                    index
                                                }
                                            >
                                                {/* カテゴリー画像 */}
                                                <div className="stock-list-image food">
                                                    <img
                                                        src={
                                                            foodCategoryImages[
                                                                food.category
                                                            ] ??
                                                            foodCategoryImages[
                                                                "その他"
                                                            ]
                                                        }
                                                        alt={
                                                            food.foodStockName
                                                        }
                                                        className="stock-icon"
                                                    />
                                                </div>

                                                <dl className="stock-list-detail">
                                                    <div>
                                                        <dt>
                                                            商品名：
                                                        </dt>
                                                        <dd>
                                                            {
                                                                food.foodStockName
                                                            }
                                                        </dd>
                                                    </div>

                                                    <div>
                                                        <dt>
                                                            追加日：
                                                        </dt>
                                                        <dd>
                                                            {formatDate(
                                                                food.addDay
                                                            )}
                                                        </dd>
                                                    </div>

                                                    <div>
                                                        <dt>
                                                            賞味期限：
                                                        </dt>
                                                        <dd>
                                                            {formatDate(
                                                                food.expirationDate
                                                            )}
                                                        </dd>
                                                    </div>

                                                    <div>
                                                        <dt>
                                                            期限まで：
                                                        </dt>
                                                        <dd>
                                                            {formatRemainingDays(
                                                                food.expirationDate
                                                            )}
                                                        </dd>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="stock-edit-button"
                                                        onClick={() =>
                                                            modFoodStart(
                                                                food
                                                            )
                                                        }
                                                    >
                                                        編集
                                                    </button>
                                                </dl>
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}
                        </>
                    )}

                    {/* 日用品一覧 */}
                    {tab === "daily" && (
                        <>
                            {dailyItems.length === 0 &&
                                !errorMessage && (
                                    <p className="stock-list-message">
                                        登録されている日用品はありません。
                                    </p>
                                )}

                            {dailyItems.length > 0 && (
                                <ul className="stock-list-items">
                                    {dailyItems.map(
                                        (item, index) => (
                                            <li
                                                className="stock-list-row"
                                                key={
                                                    item.dailyItemStockId ??
                                                    index
                                                }
                                            >
                                                {/* カテゴリー画像 */}
                                                <div className="stock-list-image daily">
                                                    <img
                                                        src={
                                                            dailyCategoryImages[
                                                                item.category
                                                            ] ??
                                                            dailyCategoryImages[
                                                                "その他"
                                                            ]
                                                        }
                                                        alt={
                                                            item.dailyItemStockName
                                                        }
                                                        className="stock-icon"
                                                    />
                                                </div>

                                                <dl className="stock-list-detail">
                                                    <div>
                                                        <dt>
                                                            商品名：
                                                        </dt>
                                                        <dd>
                                                            {
                                                                item.dailyItemStockName
                                                            }
                                                        </dd>
                                                    </div>

                                                    <div>
                                                        <dt>
                                                            追加日：
                                                        </dt>
                                                        <dd>
                                                            {formatDate(
                                                                item.addDate
                                                            )}
                                                        </dd>
                                                    </div>

                                                    <div>
                                                        <dt>
                                                            交換目安日：
                                                        </dt>
                                                        <dd>
                                                            {formatDate(
                                                                item.guideExDate
                                                            )}
                                                        </dd>
                                                    </div>

                                                    <div>
                                                        <dt>
                                                            交換まで：
                                                        </dt>
                                                        <dd>
                                                            {formatRemainingDays(
                                                                item.guideExDate
                                                            )}
                                                        </dd>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="stock-edit-button"
                                                        onClick={() =>
                                                            modDailyItemStart(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        編集
                                                    </button>
                                                </dl>
                                            </li>
                                        )
                                    )}
                                </ul>
                            )}
                        </>
                    )}

                    {/* 編集モーダル */}
                    {showModal && (
                        <div
                            className="stock-modal-overlay"
                            onClick={closeModal}
                        >
                            <div
                                className="stock-modal"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="stock-modal-title"
                                onClick={(event) =>
                                    event.stopPropagation()
                                }
                            >
                                <h2 id="stock-modal-title">
                                    {editType === "food"
                                        ? "食材編集"
                                        : "日用品編集"}
                                </h2>

                                {editType === "food" ? (
                                    <>
                                        <div>
                                            <label htmlFor="foodStockName">
                                                商品名
                                            </label>

                                            <input
                                                id="foodStockName"
                                                type="text"
                                                name="foodStockName"
                                                value={
                                                    modFood.foodStockName
                                                }
                                                onChange={
                                                    inputModFood
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="foodCategory">
                                                カテゴリ
                                            </label>

                                            <select
                                                id="foodCategory"
                                                name="category"
                                                value={
                                                    modFood.category
                                                }
                                                onChange={
                                                    inputModFood
                                                }
                                            >
                                                <option value="">
                                                    選択してください
                                                </option>
                                                <option value="冷蔵">
                                                    冷蔵
                                                </option>
                                                <option value="常温">
                                                    常温
                                                </option>
                                                <option value="冷凍">
                                                    冷凍
                                                </option>
                                                <option value="野菜">
                                                    野菜
                                                </option>
                                                <option value="肉">
                                                    肉
                                                </option>
                                                <option value="魚">
                                                    魚
                                                </option>
                                                <option value="飲料">
                                                    飲料
                                                </option>
                                                <option value="調味料">
                                                    調味料
                                                </option>
                                                <option value="その他">
                                                    その他
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="foodAddDay">
                                                追加日
                                            </label>

                                            <input
                                                id="foodAddDay"
                                                type="date"
                                                name="addDay"
                                                value={
                                                    modFood.addDay
                                                }
                                                onChange={
                                                    inputModFood
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="foodExpirationDate">
                                                賞味期限
                                            </label>

                                            <input
                                                id="foodExpirationDate"
                                                type="date"
                                                name="expirationDate"
                                                value={
                                                    modFood.expirationDate
                                                }
                                                onChange={
                                                    inputModFood
                                                }
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label htmlFor="dailyItemStockName">
                                                商品名
                                            </label>

                                            <input
                                                id="dailyItemStockName"
                                                type="text"
                                                name="dailyItemStockName"
                                                value={
                                                    modDailyItem.dailyItemStockName
                                                }
                                                onChange={
                                                    inputModDailyItem
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="dailyCategory">
                                                カテゴリ
                                            </label>

                                            <select
                                                id="dailyCategory"
                                                name="category"
                                                value={
                                                    modDailyItem.category
                                                }
                                                onChange={
                                                    inputModDailyItem
                                                }
                                            >
                                                <option value="">
                                                    選択してください
                                                </option>
                                                <option value="生活用品">
                                                    生活用品
                                                </option>
                                                <option value="衛生用品">
                                                    衛生用品
                                                </option>
                                                <option value="掃除用品">
                                                    掃除用品
                                                </option>
                                                <option value="その他">
                                                    その他
                                                </option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="dailyAddDate">
                                                追加日
                                            </label>

                                            <input
                                                id="dailyAddDate"
                                                type="date"
                                                name="addDate"
                                                value={
                                                    modDailyItem.addDate
                                                }
                                                onChange={
                                                    inputModDailyItem
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="dailyGuideExDate">
                                                交換目安日
                                            </label>

                                            <input
                                                id="dailyGuideExDate"
                                                type="date"
                                                name="guideExDate"
                                                value={
                                                    modDailyItem.guideExDate
                                                }
                                                onChange={
                                                    inputModDailyItem
                                                }
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="stock-modal-actions">
                                    <button
                                        type="button"
                                        onClick={updateStock}
                                    >
                                        更新
                                    </button>

                                    <button
                                        type="button"
                                        onClick={closeModal}
                                    >
                                        キャンセル
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Stock;