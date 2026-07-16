import { useState } from "react";
import axios from "axios";
import riceImage from "../assets/rice.png";
import "../css/Home.css";

function Home() {

    const [modalType, setModalType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    function showAlert(message) {
        setAlertMessage(message);

        setTimeout(() => {
            setAlertMessage("");
        }, 3000);
    }
    const weekNumber = {
        "月曜日": 1,
        "火曜日": 2,
        "水曜日": 3,
        "木曜日": 4,
        "金曜日": 5,
        "土曜日": 6,
        "日曜日": 7
    };

    const weekList = [
        "月曜日",
        "火曜日",
        "水曜日",
        "木曜日",
        "金曜日",
        "土曜日",
        "日曜日"
    ];
    const [burnableDay, setBurnableDay] = useState("");
    const [nonBurnableDay, setNonBurnableDay] = useState("");
    const [petBottleDay, setPetBottleDay] = useState("");
    const [canBottleDay, setCanBottleDay] = useState("");
    const [notification, setNotification] = useState(false);
    function shoppingClick() {
        console.log("買い物画面に遷移");
    }

    async function saveGarbageRule() {

        if (burnableDay === "") {
            showAlert("燃えるゴミ出し曜日を選択してください。");
            return;
        }

        try {
            await axios.post("/api/home/garbage/add", {
                garbageType: "燃えるゴミ",
                cycle: "毎週",
                garbageDay: weekNumber[burnableDay],
                userId: 1
            });

            await axios.post("/api/home/garbage/add", {
                garbageType: "燃えないゴミ",
                cycle: "毎週",
                garbageDay: weekNumber[nonBurnableDay],
                userId: 1
            });

            await axios.post("/api/home/garbage/add", {
                garbageType: "ペットボトル",
                cycle: "毎週",
                garbageDay: weekNumber[petBottleDay],
                userId: 1
            });

            await axios.post("/api/home/garbage/add", {
                garbageType: "缶・びん",
                cycle: "毎週",
                garbageDay: weekNumber[canBottleDay],
                userId: 1
            });

            showAlert("ゴミルールの設定を更新しました。");



            setModalType("");

        } catch (error) {
            console.error(error);
            showAlert("登録に失敗しました");
        }
    }
    return (

        <div className="home">

            {alertMessage && (
                <div className="customAlert">
                    <span className="dot"></span>
                    {alertMessage}
                </div>
            )}

            {/* ポイント */}
            <div className="point">
                <p>現在の米粒ポイント</p>
                <h1>3</h1>
                {/* <h1>const[point,setPoint]=useState(0)</h1> */}
            </div>

            {/* 買い物リスト */}
            <button className="shoppingBtn" onClick={shoppingClick}>
                買い物リストを作成
            </button>

            {/* ボタン */}
            <div className="buttonArea">
                <button onClick={() => setModalType("garbage")}>
                    ゴミルール設定
                </button>

                <button onClick={() => setModalType("about")}>
                    アプリについて
                </button>

                <button onClick={() => setModalType("music")}>
                    今日の曲
                </button>
            </div>

            {/* 豆知識 */}
            <div className="riceArea">
                <div className="tips">
                    tips
                </div>

                {/* 米キャラクター */}
                <div className="rice">
                    <img src={riceImage} alt="米" />
                </div>
            </div>
            {modalType === "garbage" && (
                <div className="modal">
                    <div className="modalContent">
                        <h2>ゴミルール</h2>

                        <p>燃えるゴミ出し曜日（必須）</p>
                        <select value={burnableDay} onChange={(e) => setBurnableDay(e.target.value)}>
                            <option value="">選択してください</option>

                            {weekList.map((week) => (
                                <option key={week} value={week}>
                                    {week}
                                </option>
                            ))}
                        </select>

                        <p>燃えないゴミ出し曜日</p>
                        <select
                            value={nonBurnableDay}
                            onChange={(e) => setNonBurnableDay(e.target.value)}
                        >
                            <option value="">選択してください</option>

                            {weekList.map((week) => (
                                <option key={week} value={week}>
                                    {week}
                                </option>
                            ))}
                        </select>

                        <p>ペットボトルゴミ出し曜日</p>
                        <select
                            value={petBottleDay}
                            onChange={(e) => setPetBottleDay(e.target.value)}
                        >
                            <option value="">選択してください</option>

                            {weekList.map((week) => (
                                <option key={week} value={week}>
                                    {week}
                                </option>
                            ))}
                        </select>

                        <p>缶・びんゴミ出し曜日</p>
                        <select
                            value={canBottleDay}
                            onChange={(e) => setCanBottleDay(e.target.value)}
                        >
                            <option value="">選択してください</option>

                            {weekList.map((week) => (
                                <option key={week} value={week}>
                                    {week}
                                </option>
                            ))}
                        </select>

                        <p>
                            ゴミ出し通知設定<br /><label className="switch">
                                <input
                                    type="checkbox"
                                    checked={notification}
                                    onChange={(e) => setNotification(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </p>
                        <button onClick={saveGarbageRule}>
                            登録
                        </button>
                        <button onClick={() => setModalType("")}>
                            閉じる
                        </button>
                    </div>
                </div>
            )}

            {modalType === "about" && (
                <div className="modal">
                    <div className="modalContent">
                        <h2>アプリについて</h2>

                        <p>ここにアプリの説明画面を作ります。</p>

                        <button onClick={() => setModalType("")}>
                            閉じる
                        </button>
                    </div>
                </div>
            )}

            {modalType === "music" && (
                <div className="modal">
                    <div className="modalContent">
                        <h2>今日の曲</h2>

                        <p>ここに今日の曲を表示します。</p>

                        <button onClick={() => setModalType("")}>
                            閉じる
                        </button>
                    </div>
                </div>
            )}


        </div>
    );

}
export default Home;