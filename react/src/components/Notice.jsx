import { useEffect, useState } from "react";
import axios from "axios";
import garbageImage from "../assets/garbage.png";
import "../css/Notice.css";
function Notice() {

    const [garbageMessage, setGarbageMessage] = useState("");
    const [expiredFoods, setExpiredFoods] = useState([]);
    const [foodList, setFoodList] = useState([]);
    const week = [
        "日曜日",
        "月曜日",
        "火曜日",
        "水曜日",
        "木曜日",
        "金曜日",
        "土曜日"
    ];

    const todayName = week[new Date().getDay()];
    useEffect(() => {

        // ゴミ情報取得
        axios.get("/api/notice/garbage")
            .then((res) => {

                const garbageList = res.data;

                let today = new Date().getDay();

                if (today === 0) {
                    today = 7;
                }

                const todayGarbage = garbageList.filter(
                    (garbage) => garbage.garbageDay === today
                );

                if (todayGarbage.length > 0) {
                    setGarbageMessage(
                        `今日は${todayName}<br />${todayGarbage[0].garbageType}の日です!`
                    );
                } else {
                    setGarbageMessage(
                        "今日はゴミの日ではありません"
                    );
                }
            });


        // 食品在庫取得
        axios.get("/api/notice/food")
            .then((res) => {

                const foods = res.data;

                if (!foods || foods.length === 0) {
                    setNearFoodMessage("食品が登録されていません");
                    return;
                }
                setFoodList(foods);
                const today = new Date();

                const expired = foods.filter(food => {

                    const expiration = new Date(food.expirationDate);

                    const diff = Math.ceil(
                        (expiration - today) / (1000 * 60 * 60 * 24)
                    );

                    return diff < 0;
                });


                setExpiredFoods(expired);
            });
    }, []);

    async function readNotice(id) {

        try {

            await axios.put(`/api/notice/food/read/${id}`);

            setFoodList(
                foodList.map(food =>
                    food.foodStockId === id
                        ? { ...food, noticeRead: true }
                        : food
                )
            );

        } catch (err) {
            console.error(err);
        }

    }
    return (
        <div className="notice2">



            <div className="garbageCard">
                <div className="garbageContent">
                    <p dangerouslySetInnerHTML={{ __html: garbageMessage }} />

                    <img
                        src={garbageImage}
                        alt="ゴミ"
                        className="garbageImage"
                    />
                </div>
            </div>
            <div className="nearestCard">

                {expiredFoods.length === 0 ? (
                    <h3>賞味期限切れの商品はありません</h3>
                )
                    :
                    (
                        <>
                            <h3>賞味期限切れの商品</h3>

                            {expiredFoods.map(food => (
                                <p key={food.foodStockId}>
                                    {food.foodStockName}
                                </p>
                            ))}

                        </>
                    )}

            </div>

            <hr />

            <div className="foodList">
                {foodList
                    .filter(food => !expiredFoods.some(
                        expired => expired.foodStockId === food.foodStockId
                    ))
                    .map(food => {

                        const today = new Date();
                        const expiration = new Date(food.expirationDate);

                        const diff = Math.ceil(
                            (expiration - today) / (1000 * 60 * 60 * 24)


                        );
                        let colorClass = "";

                        if (diff < 0) {
                            colorClass = "expired";
                        } else if (diff <= 3) {
                            colorClass = "warning";
                        } else {
                            colorClass = "safe";
                        }


                        return (
                            <div
                                className={`foodCard ${colorClass}`}
                                key={food.foodStockId}
                                onClick={() => readNotice(food.foodStockId)}
                            >

                                {!food.noticeRead && (
                                    <div className="unreadMark"></div>
                                )}

                                <p>
                                    {diff >= 0
                                        ? `${food.foodStockName}の賞味期限が残り${diff}日です`
                                        : `${food.foodStockName}の賞味期限が切れています`}
                                </p>

                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default Notice;