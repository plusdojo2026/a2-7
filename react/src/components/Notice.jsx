import { useEffect, useState } from "react";
import axios from "axios";
import garbageImage from "../assets/garbage.png";
import "../css/Notice.css";
function Notice() {

    const [garbageMessage, setGarbageMessage] = useState("");
    const [nearFoodMessage, setNearFoodMessage] = useState("");
    const [foodList, setFoodList] = useState([]);
    const [nearestFood, setNearestFood] = useState(null);
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
                const nearestFood = foods[0];
                setNearestFood(nearestFood);
                const today = new Date();
                const expiration = new Date(nearestFood.expirationDate);
                const diff = Math.ceil(
                    (expiration - today) / (1000 * 60 * 60 * 24)
                );

                if (diff >= 0) {
                    setNearFoodMessage(
                        `${nearestFood.foodStockName}は賞味期限まで残り${diff}日です`
                    );
                } else {
                    setNearFoodMessage(
                        `${nearestFood.foodStockName}は賞味期限が切れています`
                    );
                }
            });
    }, []);


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
                <h3>{nearFoodMessage}</h3>
            </div>

            <hr />

            <div className="foodList">
                {foodList
                    .filter(food => food.foodStockId !== nearestFood?.foodStockId)
                    .map(food => {

                        const today = new Date();
                        const expiration = new Date(food.expirationDate);

                        const diff = Math.ceil(
                            (expiration - today) / (1000 * 60 * 60 * 24)
                        );

                        return (
                            <div className="foodCard" key={food.foodStockId}>
                                <h4>{food.foodStockName}</h4>
                                <p>
                                    {diff >= 0
                                        ? `賞味期限まで残り${diff}日`
                                        : "賞味期限が切れています"}
                                </p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default Notice;