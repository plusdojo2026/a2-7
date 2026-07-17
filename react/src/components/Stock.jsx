import { useState, useEffect } from "react";
//import "../css/Stock.css";
import axios from "axios";

const Stock = () => {

    // Spring Bootから取得した食材在庫を保存する配列
    let [foods, setFoods] = useState([]);

    // Spring Bootから取得した日用品在庫を保存する配列
    let [dailyItems, setDailyItems] = useState([]);

    // 現在表示しているタブを保存
    let [tab, setTab] = useState("food");

    // API通信に失敗した場合に表示するエラーメッセージ
    let [errorMessage, setErrorMessage] = useState("");


    //取得したJSONデータをfoodsへ保存
    let refreshFoodStockList = () => {
        axios.get("http://localhost:8080/api/food_stock/")
            .then(response => {
                // APIから受け取った食材配列をStateへ保存
                setFoods(response.data);
            })
            .catch(error => {
                console.error("食材在庫の取得に失敗しました", error);

                setErrorMessage("食材在庫を取得できませんでした。");
            });
    };

    /**
     * Spring Bootから日用品在庫を取得する関数
     * 取得したJSONデータをdailyItemsへ保存する。
     */
    let refreshDailyItemStockList = () => {
        axios.get("http://localhost:8080/api/daily-item-stock")
            .then(response => {
                // APIから受け取った日用品配列をStateへ保存
                setDailyItems(response.data);
            })
            .catch(error => {
                console.error("日用品在庫の取得に失敗しました", error);

                setErrorMessage("日用品在庫を取得できませんでした。");
            });
    };

    /**
     * 食材と日用品の一覧を両方最新の状態にする関数
     * 再読み込みボタンを押した場合にも使用する
     */
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

    /**
     * 食材一覧タブを表示する関数
     */
    let showFoodList = () => {
        setTab("food");
    };

    /**
     * 日用品一覧タブを表示する関数
     */
    let showDailyItemList = () => {
        setTab("daily");
    };

    /**
     * 「2026-07-17」のような日付を
     * 「2026/07/17」の形に変換する関数
     *
     * @param {string} dateText - 変換する日付
     * @returns {string} 画面に表示する日付
     */
    let formatDate = (dateText) => {
        // 日付が登録されていない場合は「未設定」と表示する。
        if (!dateText) {
            return "未設定";
        }

        // 日付の先頭10文字を取得し、ハイフンをスラッシュへ変更する。
        return String(dateText).slice(0, 10).replaceAll("-", "/");
    };

    /**
     * 今日から期限までの残り日数を計算する関数
     *
     * @param {string} dateText - 賞味期限または交換目安日
     * @returns {number|null} 期限までの日数
     */
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

    /**
 * 日用品の交換目安日までの残り日数を、画面表示用の文字にする関数
 *
 * @param {string} guideExDate - 日用品の交換目安日
 * @returns {string} 「残り10日」「今日」「3日経過」などの文字
 */

    //食材と日用品の残り日数を出す関数
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

    /**
     * 現在表示している一覧から、期限が近い商品を探す関数
     * 期限切れ、または期限まで残り2日以内の商品を一件知らせる。
     *
     * @returns {string} 画面へ表示する期限警告
     */
    let getExpirationAlert = () => {
        // 食材タブを表示している場合
        if (tab === "food") {
            // 食材を先頭から一件ずつ確認する。
            for (let food of foods) {
                let remainingDays = getRemainingDays(food.expirationDate);

                // 期限が設定されていて、残り2日以内の場合
                if (remainingDays !== null && remainingDays <= 2) {
                    if (remainingDays < 0) {
                        return `${food.foodStockName}の賞味期限が切れています。`;
                    }

                    if (remainingDays === 0) {
                        return `${food.foodStockName}の賞味期限は今日です。`;
                    }

                    return `${food.foodStockName}の賞味期限が残り${remainingDays}日です。`;
                }
            }
        }

        // 日用品タブを表示している場合
        if (tab === "daily") {
            // 日用品を先頭から一件ずつ確認する
            for (let item of dailyItems) {
                let remainingDays = getRemainingDays(item.guideExDate);

                // 交換目安日が設定されていて、残り2日以内の場合
                if (remainingDays !== null && remainingDays <= 2) {
                    if (remainingDays < 0) {
                        return `${item.dailyItemStockName}の交換目安日が切れています。`;
                    }

                    if (remainingDays === 0) {
                        return `${item.dailyItemStockName}の交換目安日は今日です。`;
                    }

                    return `${item.dailyItemStockName}の交換目安日が残り${remainingDays}日です。`;
                }
            }
        }

        // 警告対象の商品がない場合は空文字を返す。
        return "";
    };

    // 現在表示中のタブに合わせて期限警告を作る。
    let expirationAlert = getExpirationAlert();


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
                    {expirationAlert && (
                        <div className="expiration-alert" role="status">
                            <span
                                className="expiration-alert-dot"
                                aria-hidden="true"
                            />
                            <span>{expirationAlert}</span>
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
                                                    src={`/image/${food.foodStockName}.png`}
                                                    alt={food.foodStockName}
                                                    onError={(e) => {
                                                        e.currentTarget.style.visibility = "hidden";
                                                    }}
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
                                            </dl>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
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
                                                    src={`/image/${item.dailyItemStockName}.png`}
                                                    alt={item.dailyItemStockName}
                                                    onError={(e) => {
                                                        e.currentTarget.style.visibility = "hidden";
                                                    }}
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