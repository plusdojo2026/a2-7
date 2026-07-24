import axios from "axios";
import { useState, useEffect } from "react";
import "../css/ChoreList.css";

// 曜日のリスト(0=月曜 〜 6=日曜)
const DAYS = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"];

// 今日の曜日を 0=月曜〜6=日曜 で返す
// JavaScriptの getDay() は 0=日曜〜6=土曜 なので、変換する
const getTodayIndex = () => {
    const jsDay = new Date().getDay();   // 0(日)〜6(土)
    return (jsDay + 6) % 7;              // 0(月)〜6(日) に変換
};

// 頻度と選択した曜日から、実施する曜日の一覧を返す
const getPatternDays = (frequency, days) => {

    if (frequency === "毎日") {
        return [0, 1, 2, 3, 4, 5, 6];
    }

    // 週2回・週1回は、選択された曜日をそのまま使う
    return days ? days : [];
};
const isDoneToday = (chore) => {

    if (!chore.lastDoneDate) {
        return false;
    }

    const today = new Date().toISOString().split("T")[0];

    return chore.lastDoneDate === today;
};
function ChoreList() {

    // どのモーダルが開いているか
    const [openModal, setOpenModal] = useState(null);

    // モーダル内のどの段階か("input" / "loading" / "result")
    const [step, setStep] = useState("input");

    // 家事提案:所要時間(スライダー)
    const [time, setTime] = useState(30);

    // 家事提案:選択したカテゴリ
    const [selected, setSelected] = useState([]);

    // 家事リスト:設定中の家事名
    const [settingChore, setSettingChore] = useState(null);

    // 家事リスト:アラート表示(文字列を入れて表示する)
    const [alert, setAlert] = useState("");

    // 提案結果
    const [result, setResult] = useState([]);

    // 全家事の設定を保存する箱
    // 例:{ "掃除機をかける": { frequency: "週2回", days: [0, 3] } }
    const [settings, setSettings] = useState({});

    // 設定画面で今選んでいる頻度
    const [frequency, setFrequency] = useState("毎日");

    // 設定画面で今選んでいる曜日(配列で持つ)
    const [days, setDays] = useState([]);

    // 家事提案から「今日の家事」に追加した家事名のリスト
    const [addedChores, setAddedChores] = useState([]);

    // 提案結果を追加するかのチェック状態
    const [addCheck, setAddCheck] = useState(false);

    // 今日の家事で完了チェックした家事名のリスト
    const [doneChores, setDoneChores] = useState([]);

    // 今日の家事モーダルの段階("list" / "finish")
    const [todayStep, setTodayStep] = useState("list");

    // 今回獲得したポイント
    const [earnedPoint, setEarnedPoint] = useState(0);

    // 家事データ(APIから取得する)
    const [chores, setChores] = useState([]);
    // 今日の家事(APIから取得)
    const [todayChores, setTodayChores] = useState([]);
    const [choreNotice, setChoreNotice] = useState([]);
    const [myChore, setMyChore] = useState("する");
    // 画面を開いたときに、ログインユーザーの家事をAPIから取得する
    useEffect(() => {
        axios.get("/api/chore/", { withCredentials: true })
            .then((res) => {
                // 配列のときだけ入れる(nullや異常値のときは空配列)
                setChores(Array.isArray(res.data) ? res.data : []);
                console.log(res.data);
            })
            .catch((err) => {
                console.error("家事一覧取得失敗", err);
                setChores([]);   // エラー時も空配列にしておく
            });
    }, []);
    // 今日の家事取得
    useEffect(() => {

        axios.get("/api/chore/today", {
            withCredentials: true
        })
            .then((res) => {

                console.log("今日の家事", res.data);

                setTodayChores(res.data);

            })
            .catch((err) => {

                console.error("今日の家事取得失敗", err);

            });

    }, []);
    // ログインユーザーの家事設定を取得
    useEffect(() => {
        axios.get("/api/chore/my", { withCredentials: true })
            .then((res) => {

                console.log("マイ家事", res.data);

                const settingData = {};

                res.data.forEach((item) => {

                    settingData[item.choreMaster.choresName] = {

                        frequency: item.frequency,

                        days: item.day
                            ? item.day.split(",").map(Number)
                            : [],

                        status: item.status

                    };

                });

                setSettings(settingData);

            })
            .catch((err) => {
                console.error("マイ家事取得失敗", err);
            });
    }, []);
    // 家事忘れ防止通知取得
    useEffect(() => {

        axios.get("/api/notice/chore", {
            withCredentials: true
        })
            .then((res) => {

                console.log("家事通知", res.data);

                setChoreNotice(res.data);

            })
            .catch((err) => {

                console.error("家事通知取得失敗", err);

            });

    }, []);
    // 今日の家事の一覧を作る
    // 「家事提案で追加した家事(最優先)」と「家事リストで今日が実施日の家事」を合流させる
    const getTodayChores = () => {
        const today = getTodayIndex();
        const list = [];

        // 1. 家事提案から追加した家事を先に入れる(最優先・リボン付き)
        addedChores.forEach(name => {
            list.push({
                name: name,
                frequency: null,          // 提案からの追加は頻度なし
                fromSuggest: true         // 青いリボンを付ける
            });
        });

        // 2. 家事リストの設定から、今日が実施日の家事を追加する
        //    ただし、すでに提案側で入っている家事名は除外する(重複表示しない)
        Object.entries(settings).forEach(([name, setting]) => {
            const patternDays = getPatternDays(setting.frequency, setting.days);
            if (patternDays.includes(today)) {
                // 提案側にすでに同じ家事名があればスキップ
                if (!list.some(item => item.name === name)) {
                    list.push({
                        name: name,
                        frequency: setting.frequency,
                        fromSuggest: false        // リボンなし
                    });
                }
            }
        });

        return list;
    };

    // 完了チェックの切り替え
    const toggleDone = (name) => {
        if (doneChores.includes(name)) {
            setDoneChores(doneChores.filter(item => item !== name));
        } else {
            setDoneChores([...doneChores, name]);
        }
    };

    // 今日の家事モーダルを開く
    const openToday = () => {

        axios.get("/api/chore/today", {
            withCredentials: true
        })
            .then((res) => {

                console.log("最新の今日の家事", res.data);

                setTodayChores(res.data);

            })
            .catch((err) => {

                console.error("今日の家事取得失敗", err);

            });


        setTodayStep("list");
        setOpenModal("today");
    };


    // 今日の家事の確定(完了画面へ + ポイントをDBに加算 + 完了日更新)
    const handleTodayConfirm = async () => {

        // 完了した家事のポイント合計
        const point = chores.reduce((total, chore) => {

            if (doneChores.includes(chore.choresName)) {

                return total + chore.point;

            }

            return total;

        }, 0);

        setEarnedPoint(point);


        // 完了した家事のlastDoneDateを更新
        if (doneChores.length > 0) {

            try {

                await axios.post(
                    "/api/chore/done",
                    doneChores,
                    {
                        withCredentials: true
                    }
                );

                console.log("家事完了日を更新しました");

            } catch (err) {

                console.error("家事完了日の更新に失敗:", err);

            }
        }


        // ポイントが1以上のときだけ、DBに加算する
        if (point > 0) {

            try {

                const res = await axios.post(
                    `/api/chore/point/${point}`,
                    {},
                    {
                        withCredentials: true
                    }
                );

                console.log("加算後のポイント:", res.data.point);

            } catch (err) {

                console.error("ポイント加算に失敗:", err);

            }
        }


        setTodayStep("finish");
    };

    // 曜日の選択/解除を切り替える
    const toggleDay = (dayIndex) => {
        if (days.includes(dayIndex)) {
            // すでに選択済みなら外す
            setDays(days.filter(d => d !== dayIndex));
        } else {
            // 週1回は1つまで、週2回は2つまで
            const limit = frequency === "週1回" ? 1 : 2;
            if (days.length < limit) {
                setDays([...days, dayIndex]);
            }
        }
    };

    // 設定画面を開く(保存済みの設定があれば読み込む)
    const openSetting = (chore) => {

        const saved = settings[chore.choresName];

        setFrequency(saved ? saved.frequency : "毎日");

        setDays(saved ? saved.days : []);

        // マイ家事登録状態
        if (saved && saved.status) {
            setMyChore("する");
        } else {
            setMyChore("しない");
        }

        setSettingChore(chore);
    };

    // 設定を確定する
    const handleSaveSetting = () => {

        // 必要な数の曜日が選ばれているかチェック
        if (frequency === "週1回" && days.length !== 1) {
            setAlert("曜日を1つ選択してください。");
            setTimeout(() => setAlert(""), 2000);
            return;
        }

        if (frequency === "週2回" && days.length !== 2) {
            setAlert("曜日を2つ選択してください。");
            setTimeout(() => setAlert(""), 2000);
            return;
        }

        axios.put(
            "/api/chore/setting",
            {
                choreMaster: {
                    choreMasterId: settingChore.choreMasterId
                },
                frequency: frequency,
                day: frequency === "毎日" ? null : days.join(",")
            },
            {
                withCredentials: true
            }
        )
            .then(() => {

                // マイ家事登録状態を変更
                if (myChore === "する") {

                    return axios.post(
                        `/api/chore/register/${settingChore.choreMasterId}`,
                        {},
                        {
                            withCredentials: true
                        }
                    );

                } else {

                    return axios.post(
                        `/api/chore/unregister/${settingChore.choreMasterId}`,
                        {},
                        {
                            withCredentials: true
                        }
                    );

                }

            })
            .then(() => {

                // React側の表示も更新
                setSettings({
                    ...settings,
                    [settingChore.choresName]: {
                        frequency: frequency,
                        days: days,
                        status: myChore === "する"
                    }
                });

                setAlert("設定が完了しました。");
                setSettingChore(null);

                setTimeout(() => setAlert(""), 2000);

            })
            .catch((err) => {

                console.error("設定保存失敗", err);

                setAlert("設定の保存に失敗しました。");

                setTimeout(() => setAlert(""), 2000);

            });

    };

    // カテゴリの選択/解除を切り替える
    const toggleSelect = (name) => {
        if (selected.includes(name)) {
            setSelected(selected.filter(item => item !== name));
        } else {
            setSelected([...selected, name]);
        }
    };

    // 家事提案モーダルを開く(段階と選択をリセット)
    const openSuggest = () => {
        setStep("input");
        setSelected([]);
        setTime(30);
        setAddCheck(false);
        setOpenModal("suggest");
    };

    // 確定 → 提案を作る → 読み込み → 結果
    const handleSuggest = () => {
        // カテゴリ未選択チェック
        if (selected.length === 0) {
            setAlert("カテゴリを選択してください。");
            setTimeout(() => setAlert(""), 2000);
            return;
        }
        // 選択したカテゴリの家事だけに絞る
        const filtered = chores.filter(chore =>
            selected.includes(chore.category)
        );
        // 順番をランダムにシャッフルする
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        // 合計が所要時間以内に収まるように上から詰める
        const suggestList = [];
        let total = 0;
        for (const chore of shuffled) {
            if (total + chore.estimatedTime <= time) {
                suggestList.push(chore);
                total += chore.estimatedTime;
            }
        }
        setResult(suggestList);
        setStep("loading");
        setTimeout(() => {
            setStep("result");
        }, 1500);
    };

    // 家事提案の終了(チェックが入っていたら今日の家事に追加)
    const handleSuggestClose = () => {
        if (addCheck) {
            // 提案結果の家事名を addedChores に追加(重複は除く)
            const names = result.map(chore => chore.choresName);
            const merged = [...new Set([...addedChores, ...names])];
            setAddedChores(merged);
        }
        setOpenModal(null);
    };
    const displayTodayChores = [
        ...todayChores.map(chore => ({

            ...chore,

            // 提案に含まれている家事ならリボン表示
            fromSuggest: addedChores.includes(
                chore.choreMaster.choresName
            )

        })),


        ...addedChores
            .filter(name =>
                !todayChores.some(
                    chore =>
                        chore.choreMaster.choresName === name
                )
            )
            .map(name => {

                const chore = chores.find(
                    item => item.choresName === name
                );

                return {
                    userChoreId: "add-" + name,
                    choreMaster: chore,
                    frequency: null,
                    lastDoneDate: null,
                    fromSuggest: true
                };

            })
    ];
    return (
        <div className="chore">

            {/* 家事忘れ防止通知 */}
            <div className="notice">

                {choreNotice.length > 0 ? (

                    choreNotice.map((notice, index) => (
                        <p key={index}>
                            {notice}
                        </p>
                    ))

                ) : (

                    <p>
                        現在、忘れている家事はありません。
                    </p>

                )}

            </div>

            {/* メニューボタン */}
            <div className="buttonArea">
                <button className="choreBtn" onClick={openToday}>今日の<br />家事</button>
                <button className="choreBtn" onClick={openSuggest}>家事<br />提案</button>
                <button className="choreBtn" onClick={() => { setSettingChore(null); setOpenModal("list"); }}>家事<br />リスト</button>
            </div>

            {/* ===== 今日の家事モーダル ===== */}
            {openModal === "today" && (
                <>
                    <div className="choreOverlay" onClick={() => setOpenModal(null)}></div>
                    <div className="choreModal">
                        <h2 className="modalTitle">今日の家事</h2>

                        {/* 家事カード一覧 */}
                        {todayStep === "list" && (
                            <>
                                {displayTodayChores.length > 0 ? (
                                    <div className="todayGrid">

                                        {displayTodayChores.map(chore => (
                                            <div
                                                className="todayCard"
                                                key={chore.userChoreId}
                                                onClick={() => {
                                                    if (!isDoneToday(chore)) {
                                                        toggleDone(chore.choreMaster.choresName);
                                                    }
                                                }}
                                            >

                                                {/* 家事提案から追加された家事にリボン表示 */}
                                                {chore.fromSuggest && (
                                                    <span className="ribbon"></span>
                                                )}

                                                <p className="todayName">
                                                    {chore.choreMaster.choresName}
                                                </p>

                                                {chore.frequency !== null && (
                                                    <p className="todayFreq">
                                                        {chore.frequency === "週2回"
                                                            ? "週2回"
                                                            : chore.frequency}
                                                    </p>
                                                )}

                                                <span
                                                    className={
                                                        (
                                                            doneChores.includes(chore.choreMaster.choresName)
                                                            || isDoneToday(chore)
                                                        )
                                                            ? "check on"
                                                            : "check"
                                                    }
                                                >
                                                    ✓
                                                </span>

                                            </div>
                                        ))}

                                    </div>
                                ) : (
                                    <p className="resultText">
                                        今日の家事は<br />
                                        まだありません。
                                    </p>
                                )}

                                <div className="btnRow">

                                    <button
                                        className="backBtn"
                                        onClick={() => setOpenModal(null)}
                                    >
                                        戻る
                                    </button>

                                    {displayTodayChores.length > 0 && (
                                        <button
                                            className="confirmBtn"
                                            onClick={handleTodayConfirm}
                                        >
                                            確定
                                        </button>
                                    )}

                                </div>

                            </>
                        )}

                        {/* 完了画面 */}
                        {todayStep === "finish" && (
                            <>
                                <p className="resultText">今日も家事お疲れさまです。</p>
                                <p className="resultText">
                                    家事を<b>{doneChores.length}つ</b>クリアしたので、<br />
                                    米粒ポイント<b>{earnedPoint}pt</b> 獲得しました🎉
                                </p>
                                <div className="btnRow">
                                    <button className="backBtn" onClick={() => setTodayStep("list")}>戻る</button>
                                    <button className="confirmBtn" onClick={() => setOpenModal(null)}>終了</button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* ===== 家事提案モーダル ===== */}
            {openModal === "suggest" && (
                <>
                    <div className="choreOverlay" onClick={() => setOpenModal(null)}></div>
                    <div className="choreModal">
                        <h2 className="modalTitle">家事提案</h2>

                        {/* 条件設定 */}
                        {step === "input" && (
                            <>
                                <p className="label">所要時間</p>
                                <input
                                    type="range"
                                    min="10"
                                    max="60"
                                    step="10"
                                    value={time}
                                    onChange={(e) => setTime(Number(e.target.value))}
                                    className="slider"
                                    style={{ "--progress": `${((time - 10) / (60 - 10)) * 100}%` }}
                                />
                                <p className="timeText">{time}分</p>

                                <div className="selectArea">
                                    {["掃除", "洗い物", "洗濯"].map(name => (
                                        <button
                                            key={name}
                                            className={selected.includes(name) ? "selectBtn on" : "selectBtn"}
                                            onClick={() => toggleSelect(name)}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>

                                <div className="btnRow">
                                    <button className="backBtn" onClick={() => setOpenModal(null)}>戻る</button>
                                    <button className="confirmBtn" onClick={handleSuggest}>確定</button>
                                </div>
                            </>
                        )}

                        {/* 読み込み */}
                        {step === "loading" && (
                            <div className="loading">
                                <div className="spinner"></div>
                            </div>
                        )}

                        {/* 結果 */}
                        {step === "result" && (
                            <>
                                <p className="resultText">所要時間:{time}分でできる家事<br />いかがでしょうか?</p>

                                {result.length > 0 ? (
                                    <div className="resultArea">
                                        {result.map((chore) => (
                                            <div className="resultItem" key={chore.choresId}>
                                                <p className="resultTime">{chore.estimatedTime}分</p>
                                                <p className="resultName">{chore.choresName}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="resultText">条件に合う家事が<br />見つかりませんでした。</p>
                                )}

                                <label className="checkLabel">
                                    <input
                                        type="checkbox"
                                        checked={addCheck}
                                        onChange={(e) => setAddCheck(e.target.checked)}
                                    />
                                    今日の家事に追加する
                                </label>

                                <div className="btnRow">
                                    <button className="backBtn" onClick={() => setStep("input")}>戻る</button>
                                    <button className="confirmBtn" onClick={handleSuggestClose}>終了</button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* ===== 家事リストモーダル ===== */}
            {openModal === "list" && (
                <>
                    <div className="choreOverlay" onClick={() => setOpenModal(null)}></div>
                    <div className="choreModal">
                        <h2 className="modalTitle">家事リスト</h2>

                        {/* 一覧 */}
                        {settingChore === null && (
                            <>
                                <div className="listArea">
                                    {chores.map((chore) => (
                                        <div
                                            className="listRow"
                                            key={chore.choresId}
                                            onClick={() => openSetting(chore)}
                                        >
                                            <span>{chore.choresName}</span>
                                            <span className="arrow">›</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="btnRow">
                                    <button className="backBtn" onClick={() => setOpenModal(null)}>戻る</button>
                                    <button className="confirmBtn" onClick={() => setOpenModal(null)}>確定</button>
                                </div>
                            </>
                        )}

                        {/* 設定画面 */}
                        {settingChore !== null && (
                            <>
                                <h3 className="settingTitle">
                                    {settingChore.choresName} -設定-
                                </h3>

                                {/* 頻度の選択 */}
                                <div className="settingItem">
                                    <p className="label">家事を行う頻度</p>
                                    <select
                                        className="select"
                                        value={frequency}
                                        onChange={(e) => {
                                            setFrequency(e.target.value);
                                            setDays([]);   // 頻度を変えたら曜日をリセット
                                        }}
                                    >
                                        <option>毎日</option>
                                        <option>週2回</option>
                                        <option>週1回</option>
                                    </select>
                                </div>

                                {/* 週2回・週1回のとき:曜日を選択 */}
                                {frequency !== "毎日" && (
                                    <div className="settingItem">
                                        <p className="label">
                                            曜日{frequency === "週2回" ? "(2つ選択)" : "(1つ選択)"}
                                        </p>
                                        <div className="dayArea">
                                            {DAYS.map((name, index) => (
                                                <button
                                                    key={name}
                                                    className={days.includes(index) ? "dayBtn on" : "dayBtn"}
                                                    onClick={() => toggleDay(index)}
                                                >
                                                    {name.charAt(0)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* <div className="settingItem">
                                    <p className="label">家事忘れ防止通知</p>
                                    <select className="select">
                                        <option>ON</option>
                                        <option>OFF</option>
                                    </select>
                                </div> */}

                                <div className="settingItem">
                                    <p className="label">マイ家事登録</p>
                                    <select
                                        className="select"
                                        value={myChore}
                                        onChange={(e) => setMyChore(e.target.value)}
                                    >
                                        <option>する</option>
                                        <option>しない</option>
                                    </select>
                                </div>

                                <div className="btnRow">
                                    <button className="backBtn" onClick={() => setSettingChore(null)}>戻る</button>
                                    <button className="confirmBtn" onClick={handleSaveSetting}>確定</button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}

            {/* アラート */}
            {/* アラート */}
            {alert !== "" && (
                <div className="alertBox">
                    <p>{alert}</p>
                </div>
            )}

        </div>
    )
}

export default ChoreList;