import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import riceImage0 from "../assets/rice0.png";
import riceImage1 from "../assets/rice1.png";
import riceImage2 from "../assets/rice2.png";
import riceImage3 from "../assets/rice3.png";
import riceImage4 from "../assets/rice4.png";
import riceImage5 from "../assets/rice5.png";
import riceImage6 from "../assets/rice6.png";
import riceImage7 from "../assets/rice7.png";
import { FiLogOut } from "react-icons/fi";
import "../css/Home.css";


function Home() {
    const navigate = useNavigate();
    const [modalType, setModalType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    function showAlert(message) {
        setAlertMessage(message);

        setTimeout(() => {
            setAlertMessage("");
        }, 3000);
    }

    const [tips, setTips] = useState(null);
    const [point, setPoint] = useState(0);

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
    const dayMap = {
        1: "月曜日",
        2: "火曜日",
        3: "水曜日",
        4: "木曜日",
        5: "金曜日",
        6: "土曜日",
        7: "日曜日"
    };

    async function openGarbageModal() {

        try {

            const res = await axios.get("/api/garbage", {
                withCredentials: true
            });

            // 一旦リセット
            setBurnableDay("");
            setNonBurnableDay("");
            setPetBottleDay("");
            setCanBottleDay("");
            setNotification(false);

            res.data.forEach((garbage) => {

                switch (garbage.garbageType) {

                    case "燃えるゴミ":
                        setBurnableDay(dayMap[garbage.garbageDay]);
                        break;

                    case "燃えないゴミ":
                        setNonBurnableDay(dayMap[garbage.garbageDay]);
                        break;

                    case "ペットボトル":
                        setPetBottleDay(dayMap[garbage.garbageDay]);
                        break;

                    case "缶・びん":
                        setCanBottleDay(dayMap[garbage.garbageDay]);
                        break;

                    default:
                        break;
                }

                if (garbage.notification != null) {
                    setNotification(garbage.notification);
                }

            });

        } catch (err) {

            console.error("ゴミルール取得失敗", err);

        }

        setModalType("garbage");
    }
    const [burnableDay, setBurnableDay] = useState("");
    const [nonBurnableDay, setNonBurnableDay] = useState("");
    const [petBottleDay, setPetBottleDay] = useState("");
    const [canBottleDay, setCanBottleDay] = useState("");
    const [notification, setNotification] = useState(false);

    useEffect(() => {
        axios.get("/api/home/tips")
            .then((res) => {
                setTips(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        axios.get("/api/home/point")
            .then((res) => {
                setPoint(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);
    let riceImage = riceImage0;

    if (point >= 60) {
        riceImage = riceImage7;
    } else if (point >= 40) {
        riceImage = riceImage6;
    } else if (point >= 30) {
        riceImage = riceImage5;
    } else if (point >= 20) {
        riceImage = riceImage4;
    } else if (point >= 10) {
        riceImage = riceImage3;
    } else if (point >= 5) {
        riceImage = riceImage2;
    } else if (point >= 1) {
        riceImage = riceImage1;
    }
    function shoppingClick() {
        navigate("/shopping");
    }
    async function logout() {

        const result = window.confirm("本当にログアウトしますか？");

        if (!result) {
            return;
        }

        try {

            await axios.post("/api/login/logout");

            navigate("/login");

        } catch (error) {

            console.error(error);

        }

    }
    async function saveGarbageRule() {

        if (burnableDay === "") {
            showAlert("燃えるゴミ出し曜日を選択してください。");
            return;
        }

        try {


            if (burnableDay !== "") {
                await axios.post(
                    "/api/garbage/save",
                    {
                        garbageType: "燃えるゴミ",
                        garbageDay: weekNumber[burnableDay],
                        notification: notification
                    },
                    {
                        withCredentials: true
                    }
                );
            }

            if (nonBurnableDay !== "") {
                await axios.post("/api/garbage/save", {
                    garbageType: "燃えないゴミ",
                    garbageDay: weekNumber[nonBurnableDay],

                    notification: notification
                },
                    {
                        withCredentials: true
                    }
                );
            }

            if (petBottleDay !== "") {
                await axios.post("/api/garbage/save", {
                    garbageType: "ペットボトル",
                    garbageDay: weekNumber[petBottleDay],

                    notification: notification
                },
                    {
                        withCredentials: true
                    }
                );
            }

            if (canBottleDay !== "") {
                await axios.post("/api/garbage/save", {
                    garbageType: "缶・びん",
                    garbageDay: weekNumber[canBottleDay],

                    notification: notification
                },
                    {
                        withCredentials: true
                    }
                );
            }

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
                    <span className="dot">●</span>
                    {alertMessage}
                </div>
            )}

            {/* ポイント */}
            <div className="point">
                <h2>現在の米粒ポイント</h2>
                <h1>{point}</h1>
                {/* <h1>const[point,setPoint]=useState(0)</h1> */}
            </div>

            <div className="buttonArea3">
                <button onClick={logout}>
                    <FiLogOut />
                </button>
            </div>

            {/* 買い物リスト */}
            <button className="shoppingBtn" onClick={shoppingClick}>
                買い物リストを作成
            </button>

            {/* ボタン */}
            <div className="buttonArea2">
                <button onClick={openGarbageModal}>
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
                    {tips ? tips.tips : "読み込み中..."}
                </div>

                {/* 米キャラクター */}
                <div className="rice">
                    <img src={riceImage} alt="米" />
                </div>
            </div>
            {modalType === "garbage" && (
                <div className="modal2">
                    <div className="modal2Content">
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
                            ゴミ出し通知設定<br /><label className="switch2">
                                <input
                                    type="checkbox"
                                    checked={notification}
                                    onChange={(e) => setNotification(e.target.checked)}
                                />
                                <span className="slider2"></span>
                            </label>
                        </p>
                        <button
                            className="closebtn"
                            onClick={() => setModalType("")}>
                            閉じる
                        </button>
                        <button
                            className="button"
                            onClick={saveGarbageRule}>
                            登録
                        </button>
                        
                    </div>
                </div>
            )}

            {modalType === "about" && (
                <div className="modal2">
                    <div className="modal2Content">
                        <h2>アプリについて</h2>

                        <p>ここにアプリの説明画面を作ります。</p>

                        <button
                            className="closebtn"
                            onClick={() => setModalType("")}>
                            閉じる
                        </button>
                    </div>
                </div>
            )}

            {modalType === "music" && (
                <div className="modal2">
                    <div className="modal2Content">
                        <h2>🎵 今日の曲</h2>

                        <h3>{tips?.music}</h3>

                        <button
                            className="closebtn"
                            onClick={() => setModalType("")}>
                            閉じる
                        </button>
                    </div>
                </div>
            )}


        </div>
    );

}
export default Home;