import { useState, useEffect } from "react";
import "../css/Stock.css";
import axios from "axios";

const Stock = () => {

    const LOGIN_USER_ID = 1;

    // Spring Bootから取得した食材在庫を保存する配列
    let [foods, setFoods] = useState([]);

    // Spring Bootから取得した日用品在庫を保存する配列
    let [dailyItems, setDailyItems] = useState([]);

    // 現在表示しているタブを保存
    let [tab, setTab] = useState("food");

    // API通信に失敗した場合に表示するエラーメッセージ
    let [errorMessage, setErrorMessage] = useState("");

    // モーダルに編集する食材を入れる
    let [modFood, setModFood] = useState({
        foodStockId: 0,
        foodStockName: "",
        category: "",
        addDay: "",
        expirationDate: "",
        status: true
    });

    // モーダルに編集する日用品を入れる
    let [modDailyItem, setModDailyItem] = useState({
        dailyItemStockId: 0,
        dailyItemStockName: "",
        category: "",
        addDate: "",
        guideExDate: "",
        status: true
    });

    // モーダルを表示するか
    let [showModal, setShowModal] = useState(false);

    // 食材と日用品のどちらを編集中か
    let [editType, setEditType] = useState("");

    // 編集画面で新しく選択した画像ファイル
    let [selectedImage, setSelectedImage] = useState(null);

    // 編集画面に表示する画像プレビューのURL
    let [imagePreview, setImagePreview] = useState("");

    //取得したJSONデータをfoodsへ保存する関数
    let refreshFoodStockList = () => {
        axios.get(`http://localhost:8080/api/food_stock/user/${LOGIN_USER_ID}`)
            .then(response => {
                // APIから受け取った食材配列をStateへ保存
                setFoods(response.data);
            })
            .catch(error => {
                console.error("食材在庫の取得に失敗しました", error);

                setErrorMessage("食材在庫を取得できませんでした。");
            });
    };

    //日用品在庫をAPIから取得する関数
    let refreshDailyItemStockList = () => {
        axios.get(`http://localhost:8080/api/daily-item-stock/user/${LOGIN_USER_ID}`)
            .then(response => {
                // APIから受け取った日用品配列をStateへ保存
                setDailyItems(response.data);
            })
            .catch(error => {
                console.error("日用品在庫の取得に失敗しました", error);

                setErrorMessage("日用品在庫を取得できませんでした。");
            });
    };

    //食材と日用品をまとめて再取得する関数
    let refreshStockList = () => {
        // 前回表示されたエラーメッセージを消す
        setErrorMessage("");

        // 食材と日用品をそれぞれ取得
        refreshFoodStockList();
        refreshDailyItemStockList();
    };


    //一度だけ実行される処理     
    useEffect(() => {
        refreshStockList();
    }, []);

    //食材一覧タブを表示する関数
    let showFoodList = () => {
        setTab("food");
    };

    //日用品一覧タブを表示する関数
    let showDailyItemList = () => {
        setTab("daily");
    };

    //日付の形を整える関数
    let formatDate = (dateText) => {
        // 日付が登録されていない場合は「未設定」と表示する。
        if (!dateText) {
            return "未設定";
        }

        // 日付の先頭10文字を取得し、ハイフンをスラッシュへ変更する。
        return String(dateText).slice(0, 10).replaceAll("-", "/");
    };


    //今日から期限までの残り日数を計算する関数
    let getRemainingDays = (dateText) => {
        // 期限が登録されていない場合は計算しない
        if (!dateText) {
            return null;
        }

        // 日付文字列を年、月、日に分ける
        let dateParts = String(dateText).slice(0, 10).split("-");
        let year = Number(dateParts[0]);
        let month = Number(dateParts[1]);
        let day = Number(dateParts[2]);

        // 正しい日付に分解できなかった場合は計算しない
        if (!year || !month || !day) {
            return null;
        }

        // 現在時刻を取り除き、今日の日付だけを作る
        let now = new Date();
        let today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        // 0から始まるため、monthから1を引く
        let targetDate = new Date(year, month - 1, day);

        // 今日と期限の差をミリ秒から日数へ変換する。
        return Math.round(
            (targetDate - today) / (1000 * 60 * 60 * 24)
        );
    };

    //日用品の交換目安日までの残り日数を画面表示用の文字にする関数
    let formatRemainingDays = (guideExDate) => {
        // 交換目安日までの日数を計算する。
        let remainingDays = getRemainingDays(guideExDate);

        // 交換目安日が登録されていない場合
        if (remainingDays === null) {
            return "未設定";
        }

        // 交換目安日を過ぎている場合
        if (remainingDays < 0) {
            return `${Math.abs(remainingDays)}日経過`;
        }

        // 交換目安日が今日の場合
        if (remainingDays === 0) {
            return "今日";
        }

        // 交換目安日が明日以降の場合
        return `残り${remainingDays}日`;
    };

    //現在表示している一覧から、期限が近い商品を探す関数
    let getExpirationAlerts = () => {

        let alerts = [];

        if (tab === "food") {

            for (let food of foods) {

                let remainingDays = getRemainingDays(food.expirationDate);

                //期限三日前にお知らせ
                if (remainingDays !== null && remainingDays <= 3) {

                    if (remainingDays < 0) {
                        alerts.push(
                            `${food.foodStockName}の賞味期限が切れています。`
                        );
                    }
                    else if (remainingDays === 0) {
                        alerts.push(
                            `${food.foodStockName}の賞味期限は今日です。`
                        );
                    }
                    else {
                        alerts.push(
                            `${food.foodStockName}の賞味期限が残り${remainingDays}日です。`
                        );
                    }
                }
            }
        }

        if (tab === "daily") {

            for (let item of dailyItems) {

                let remainingDays = getRemainingDays(item.guideExDate);

                if (remainingDays !== null && remainingDays <= 3) {

                    if (remainingDays < 0) {
                        alerts.push(
                            `${item.dailyItemStockName}の交換目安日が切れています。`
                        );
                    }
                    else if (remainingDays === 0) {
                        alerts.push(
                            `${item.dailyItemStockName}の交換目安日は今日です。`
                        );
                    }
                    else {
                        alerts.push(
                            `${item.dailyItemStockName}の交換目安日が残り${remainingDays}日です。`
                        );
                    }
                }
            }
        }

        return alerts;
    };

    // 現在表示中のタブに合わせて期限警告を作る。
    let expirationAlerts = getExpirationAlerts();

    //食材フォームの入力関数
    let inputModFood = (e) => {
        let inputValue = e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value;

        setModFood({
            ...modFood,
            [e.target.name]: inputValue
        });
    };

    //日用品の入力関数
    let inputModDailyItem = (e) => {
        let inputValue = e.target.type === "checkbox"
            ? e.target.checked
            : e.target.value;

        setModDailyItem({
            ...modDailyItem,
            [e.target.name]: inputValue
        });
    };

    //食材の編集開始関数
    let modFoodStart = (food) => {
        setModFood({ ...food });

        // 前回選択した画像をリセットする
        setSelectedImage(null);

        // すでに画像が登録されている場合は現在の画像を表示する
        setImagePreview(
            food.foodImage
                ? `http://localhost:8080/uploads/${food.foodImage}`
                : foodCategoryImages[food.category] ?? foodCategoryImages["その他"]
        );

        setEditType("food");
        setShowModal(true);
    };

    //日用品の編集開始関数
    let modDailyItemStart = (item) => {
        setModDailyItem({ ...item });

        // 前回選択した画像をリセットする
        setSelectedImage(null);

        // すでに画像が登録されている場合は現在の画像を表示する
        setImagePreview(
            item.dailyItemImage
                ? `http://localhost:8080/uploads/${item.dailyItemImage}`
                : dailyCategoryImages[item.category] ?? dailyCategoryImages["その他"]
        );

        setEditType("daily");
        setShowModal(true);
    };

    //画像ファイルを選択したときの処理
    let selectImage = (e) => {
        let file = e.target.files?.[0];

        if (!file) {
            return;
        }

        // 画像ファイル以外は受け付けない
        if (!file.type.startsWith("image/")) {
            setErrorMessage("画像ファイルを選択してください。");
            e.target.value = "";
            return;
        }

        setErrorMessage("");
        setSelectedImage(file);

        // 選択した画像をモーダル内へ一時表示する
        setImagePreview(URL.createObjectURL(file));
    };

    //モーダルを閉じる
    let closeModal = () => {
        // createObjectURLで作成した一時URLを解放する
        if (selectedImage && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }

        setShowModal(false);
        setEditType("");
        setSelectedImage(null);
        setImagePreview("");
    };

    //更新処理
    let updateStock = () => {
        setErrorMessage("");

        if (editType === "food") {

            // JSONデータと画像を同時に送るためFormDataを使用する
            let formData = new FormData();

            let foodJson = new Blob(
                [JSON.stringify(modFood)],
                { type: "application/json" }
            );

            // Spring Boot側の@RequestPart("food")と名前を合わせる
            formData.append("food", foodJson);

            // 新しい画像が選択されている場合だけ追加する
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            axios.post(
                `http://localhost:8080/api/food_stock/mod-image/user/${LOGIN_USER_ID}`,
                formData
            )
                .then(() => {
                    refreshFoodStockList();
                    closeModal();
                })
                .catch(error => {
                    console.error("食材在庫の更新に失敗しました", error);
                    setErrorMessage("食材在庫を更新できませんでした。");
                });

            return;
        }

        if (editType === "daily") {

            // JSONデータと画像を同時に送るためFormDataを使用する
            let formData = new FormData();

            let dailyItemJson = new Blob(
                [JSON.stringify(modDailyItem)],
                { type: "application/json" }
            );

            // Spring Boot側の@RequestPart("item")と名前を合わせる
            formData.append("item", dailyItemJson);

            // 新しい画像が選択されている場合だけ追加する
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            axios.post(
                `http://localhost:8080/api/daily-item-stock/mod-image/user/${LOGIN_USER_ID}`,
                formData
            )
                .then(() => {
                    refreshDailyItemStockList();
                    closeModal();
                })
                .catch(error => {
                    console.error("日用品在庫の更新に失敗しました", error);
                    setErrorMessage("日用品在庫を更新できませんでした。");
                });
        }
    };

    //食材のアイコン
    const foodCategoryImages = {
        "冷蔵": "/img/reizou.png",
        "飲料": "/img/innryou.png",
        "野菜": "/img/yasai.png",
        "常温": "/img/jouonn.png",
        "調味料": "/img/tyoumiryou.png",
        "肉": "/img/niku.png",
        "魚": "/img/sakana.png",
        "冷凍": "/img/reitou.png",
        "その他": "/img/sonota_syokuzai.png",
    };

    //日用品のアイコン
    const dailyCategoryImages = {
        "生活用品": "/img/seikatuyouhinn.png",
        "衛生用品": "/img/eiseiyouhinn.png",
        "掃除用品": "/img/soujiyouhinn.png",
        "その他": "/img/sonota_nitiyouhinn.png",
    };

    // 【UIレンダリング部】
    return (
        <div className="stock-list-page">
            <section className="stock-list-app" aria-label="在庫一覧">

                {/* 1. 食材一覧と日用品一覧を切り替えるタブ */}
                <div className="stock-list-tabs" role="tablist">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={tab === "food"}
                        className={
                            tab === "food"
                                ? "stock-list-tab active"
                                : "stock-list-tab"
                        }
                        onClick={showFoodList}
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
                        onClick={showDailyItemList}
                    >
                        日用品一覧
                    </button>
                </div>

                <div className="stock-list-content">

                    {/* 2. 期限が近い商品がある場合に表示する警告 */}
                    {expirationAlerts.length > 0 && (
                        <div className="expiration-alert" role="status">

                            {expirationAlerts.map((alert, index) => (
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
                            ))}

                        </div>
                    )}

                    {/* 3. API通信に失敗した場合に表示するエラー */}
                    {errorMessage && (
                        <div className="stock-list-error" role="alert">
                            <p>{errorMessage}</p>
                            <button type="button" onClick={refreshStockList}>
                                もう一度読み込む
                            </button>
                        </div>
                    )}

                    {/* 4. 食材一覧：foodタブのときだけ表示する */}
                    {tab === "food" && (
                        <>
                            {/* 食材が0件の場合に表示するメッセージ */}
                            {foods.length === 0 && !errorMessage && (
                                <p className="stock-list-message">
                                    登録されている食材はありません。
                                </p>
                            )}

                            {/* foods配列を一件ずつ画面へ表示する */}
                            {foods.length > 0 && (
                                <ul className="stock-list-items">
                                    {foods.map((food, index) => (
                                        <li
                                            className="stock-list-row"
                                            key={food.foodStockId ?? index}
                                        >
                                            {/* 商品名と同じ名前の画像を表示する */}
                                            <div className="stock-list-image food">
                                                <img
                                                    src={
                                                        food.foodImage
                                                            ? `http://localhost:8080/uploads/${food.foodImage}`
                                                            : foodCategoryImages[food.category] ?? foodCategoryImages["その他"]
                                                    }
                                                    alt={food.foodStockName}
                                                    className="stock-icon"
                                                />
                                            </div>

                                            {/* 食材の商品名、追加日、賞味期限 */}
                                            <dl className="stock-list-detail">
                                                <div>
                                                    <dt>商品名：</dt>
                                                    <dd>{food.foodStockName}</dd>
                                                </div>
                                                <div>
                                                    <dt>追加日：</dt>
                                                    <dd>{formatDate(food.addDay)}</dd>
                                                </div>
                                                <div>
                                                    <dt>賞味期限：</dt>
                                                    <dd>{formatDate(food.expirationDate)}</dd>
                                                </div>
                                                <div>
                                                    <dt>期限まで：</dt>
                                                    <dd>{formatRemainingDays(food.expirationDate)}</dd>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="stock-edit-button"
                                                    onClick={() => modFoodStart(food)}
                                                >
                                                    編集
                                                </button>
                                            </dl>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}

                    {showModal && (
                        <div className="stock-modal-overlay">
                            <div className="stock-modal">

                                <h2>
                                    {editType === "food" ? "食材編集" : "日用品編集"}
                                </h2>

                                {editType === "food" ? (
                                    <>
                                        <div>
                                            <label>商品名</label>
                                            <input
                                                type="text"
                                                name="foodStockName"
                                                value={modFood.foodStockName}
                                                onChange={inputModFood}
                                            />
                                        </div>

                                        <div>
                                            <label>カテゴリ</label>
                                            <select
                                                name="category"
                                                value={modFood.category ?? ""}
                                                onChange={inputModFood}
                                            >
                                                <option value="">選択してください</option>
                                                <option value="冷蔵">冷蔵</option>
                                                <option value="常温">常温</option>
                                                <option value="冷凍">冷凍</option>
                                                <option value="野菜">野菜</option>
                                                <option value="肉">肉</option>
                                                <option value="魚">魚</option>
                                                <option value="飲料">飲料</option>
                                                <option value="調味料">調味料</option>
                                                <option value="その他">その他</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label>追加日</label>
                                            <input
                                                type="date"
                                                name="addDay"
                                                value={modFood.addDay}
                                                onChange={inputModFood}
                                            />
                                        </div>

                                        <div>
                                            <label>賞味期限</label>
                                            <input
                                                type="date"
                                                name="expirationDate"
                                                value={modFood.expirationDate}
                                                onChange={inputModFood}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label>商品名</label>
                                            <input
                                                type="text"
                                                name="dailyItemStockName"
                                                value={modDailyItem.dailyItemStockName}
                                                onChange={inputModDailyItem}
                                            />
                                        </div>

                                        <div>
                                            <label>カテゴリ</label>
                                            <select
                                                name="category"
                                                value={modDailyItem.category ?? ""}
                                                onChange={inputModDailyItem}
                                            >
                                                <option value="">選択してください</option>
                                                <option value="生活用品">生活用品</option>
                                                <option value="衛生用品">衛生用品</option>
                                                <option value="掃除用品">掃除用品</option>
                                                <option value="その他">その他</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label>追加日</label>
                                            <input
                                                type="date"
                                                name="addDate"
                                                value={modDailyItem.addDate}
                                                onChange={inputModDailyItem}
                                            />
                                        </div>

                                        <div>
                                            <label>交換目安日</label>
                                            <input
                                                type="date"
                                                name="guideExDate"
                                                value={modDailyItem.guideExDate}
                                                onChange={inputModDailyItem}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* 食材・日用品で共通の画像編集欄 */}
                                <div className="stock-modal-image-field">
                                    <label htmlFor="stock-image">画像</label>

                                    <input
                                        id="stock-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={selectImage}
                                    />

                                    {imagePreview && (
                                        <img
                                            src={imagePreview}
                                            alt="選択画像のプレビュー"
                                            className="stock-image-preview"
                                        />
                                    )}
                                </div>

                                <div className="stock-modal-actions">
                                    <button type="button" onClick={updateStock}>
                                        更新
                                    </button>

                                    <button type="button" onClick={closeModal}>
                                        キャンセル
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* 5. 日用品一覧：dailyタブのときだけ表示する */}
                    {tab === "daily" && (
                        <>
                            {/* 日用品が0件の場合に表示するメッセージ */}
                            {dailyItems.length === 0 && !errorMessage && (
                                <p className="stock-list-message">
                                    登録されている日用品はありません。
                                </p>
                            )}

                            {/* dailyItems配列を一件ずつ画面へ表示する */}
                            {dailyItems.length > 0 && (
                                <ul className="stock-list-items">
                                    {dailyItems.map((item, index) => (
                                        <li
                                            className="stock-list-row"
                                            key={item.dailyItemStockId ?? index}
                                        >
                                            {/* 商品名と同じ名前の画像を表示する */}
                                            <div className="stock-list-image daily">
                                                <img
                                                    src={
                                                        item.dailyItemImage
                                                            ? `http://localhost:8080/uploads/${item.dailyItemImage}`
                                                            : dailyCategoryImages[item.category] ?? dailyCategoryImages["その他"]
                                                    }
                                                    alt={item.dailyItemStockName}
                                                    className="stock-icon"
                                                />
                                            </div>

                                            {/* 日用品の商品名、追加日、交換目安日 */}
                                            <dl className="stock-list-detail">
                                                <div>
                                                    <dt>商品名：</dt>
                                                    <dd>{item.dailyItemStockName}</dd>
                                                </div>
                                                <div>
                                                    <dt>追加日：</dt>
                                                    <dd>{formatDate(item.addDate)}</dd>
                                                </div>
                                                <div>
                                                    <dt>交換目安日：</dt>
                                                    <dd>{formatDate(item.guideExDate)}</dd>
                                                </div>
                                                <div>
                                                    <dt>交換まで：</dt>
                                                    <dd>{formatRemainingDays(item.guideExDate)}</dd>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="stock-edit-button"
                                                    onClick={() => modDailyItemStart(item)}
                                                >
                                                    編集
                                                </button>
                                            </dl>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Stock;