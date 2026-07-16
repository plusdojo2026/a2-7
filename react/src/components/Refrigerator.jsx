import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Refrigerator.css";
function Refrigerator() {
  // Spring Bootから取得した在庫
  const [foods, setFoods] = useState([]);
  const [items, setItems] = useState([]);

  // 現在表示しているタブ
  const [tab, setTab] = useState("food");

  // 画面ロード時に食材と日用品を取得
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/food_stock/")
      .then((res) => {
        setFoods(res.data);
      })
      .catch((error) => {
        console.error("食材の取得に失敗しました", error);
      });

    axios
      .get("http://localhost:8080/api/daily_item_stock/")
      .then((res) => {
        setItems(res.data);
      })
      .catch((error) => {
        console.error("日用品の取得に失敗しました", error);
      });
  }, []);

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
                {foods.map((food, index) => (
                  <div
                    key={food.foodStockId}
                    className={`stored-item position-${index % 6}`}
                    draggable
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
                      src={`/image/${food.foodStockName}.png`}
                      alt={food.foodStockName}
                    />
                    <span>{food.foodStockName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 食材用ゴミ箱 */}
            <div
              className="trash-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                // 後で削除処理を書く
              }}
            >
              🗑
              <span>ここへ捨てる</span>
            </div>

            {/* 登録候補の食材一覧 */}
            <div className="candidate-list">
              {foods.map((food) => (
                <div
                  key={`candidate-${food.foodStockId}`}
                  className="candidate-item"
                  draggable
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
                    src={`/image/${food.foodStockName}.png`}
                    alt={food.foodStockName}
                  />
                  <span>{food.foodStockName}</span>
                </div>
              ))}
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
                {items.map((item, index) => (
                  <div
                    key={item.dailyItemStockId}
                    className={`stored-item position-${index % 6}`}
                    draggable
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
                      src={`/image/${item.dailyItemStockName}.png`}
                      alt={item.dailyItemStockName}
                    />
                    <span>{item.dailyItemStockName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 日用品用ゴミ箱 */}
            <div
              className="trash-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                // 後で削除処理を書く
              }}
            >
              🗑
              <span>ここへ捨てる</span>
            </div>

            {/* 登録候補の日用品一覧 */}
            <div className="candidate-list">
              {items.map((item) => (
                <div
                  key={`candidate-${item.dailyItemStockId}`}
                  className="candidate-item"
                  draggable
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
                    src={`/image/${item.dailyItemStockName}.png`}
                    alt={item.dailyItemStockName}
                  />
                  <span>{item.dailyItemStockName}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Refrigerator;