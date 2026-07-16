import { useEffect, useState } from "react";
import axios from "axios";

function Notice() {

    const [garbageMessage, setGarbageMessage] = useState("");
    const [nearFoodMessage, setNearFoodMessage] = useState("");
    const [foodList, setFoodList] = useState([]);

    useEffect(() => {

        // ゴミ情報取得
        axios.get("/api/home/garbage")
            .then((res) => {

                const garbageList = res.data;

                let today = new Date().getDay();

                if (today === 0) {
                    today = 7;
                }

                const todayGarbage = garbageList.filter(
                    (garbage) => garbage.garbage_day === today
                );

                if (todayGarbage.length > 0) {
                    setGarbageMessage(
                        `今日は${todayGarbage[0].garbageType}の日です`
                    );
                } else {
                    setGarbageMessage(
                        "今日はゴミの日ではありません"
                    );
                }
            });


        // 食品在庫取得
        axios.get("/api/foodstock")
            .then((res) => {

                const foods = res.data;

                const today = new Date();

                // 一覧表示用
                setFoodList(foods);


                // 賞味期限が近い順に並び替え
                const sortedFoods = [...foods].sort((a, b) => {

                    const dateA = new Date(a.addDay);
                    dateA.setDate(
                        dateA.getDate() + a.foodMaster.expirationDate
                    );

                    const dateB = new Date(b.addDay);
                    dateB.setDate(
                        dateB.getDate() + b.foodMaster.expirationDate
                    );

                    return dateA - dateB;
                });


                // 一番賞味期限が近い食品
                const nearestFood = sortedFoods[0];


                if (nearestFood) {

                    // 賞味期限を計算
                    const expiration = new Date(nearestFood.addDay);

                    expiration.setDate(
                        expiration.getDate()
                        + nearestFood.foodMaster.expirationDate
                    );


                    const diff = Math.ceil(
                        (expiration - today)
                        / (1000 * 60 * 60 * 24)
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
                }

            });
    }, []);


    return (
        <div>

            <h2>お知らせ</h2>

            <h3>ゴミのお知らせ</h3>
            <p>{garbageMessage}</p>


            <h3>賞味期限のお知らせ</h3>
            <p>{nearFoodMessage}</p>


            <h3>賞味期限一覧</h3>

            <table>
                <tbody>
                    {foodList.map((food) => {

                        const expiration = new Date(food.addDay);

                        expiration.setDate(
                            expiration.getDate()
                            + food.foodMaster.expirationDate
                        );

                        return (
                            <tr key={food.foodStockId}>
                                <td>{food.foodStockName}</td>
                                <td>
                                    {expiration.toLocaleDateString()}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Notice;