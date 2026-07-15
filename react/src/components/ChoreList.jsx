import { useState } from "react";
import "./ChoreList.css";

function ChoreList(){

    // どのモーダルが開いているか
    const [openModal, setOpenModal] = useState(null);

    // モーダル内のどの段階か("input" / "loading" / "result")
    const [step, setStep] = useState("input");

    // 家事提案:所要時間(スライダー)
    const [time, setTime] = useState(30);

    // 家事提案:選択した家事
    const [selected, setSelected] = useState([]);

    // 家事リスト:設定中の家事名
    const [settingChore, setSettingChore] = useState(null);

    // 家事リスト:アラート表示
    const [alert, setAlert] = useState(false);

    // 家事の選択/解除を切り替える
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
        setOpenModal("suggest");
    };

    // 確定 → 読み込み → 結果
    const handleSuggest = () => {
        setStep("loading");
        setTimeout(() => setStep("result"), 1500);
    };

    return(
        <div className="chore">

    {/* タブ */}
    <div className="menu">
        <button>お知らせ</button>
        <button>ホーム</button>
        <button className="active">家事</button>
    </div>

    {/* 家事忘れ防止通知 */}
    <div className="notice">
        <p>トイレ掃除を行ってから1週間<br />以上経過しています。</p>
    </div>

    {/* メニューボタン */}
    <div className="buttonArea">
        <button className="choreBtn" onClick={() => setOpenModal("today")}>今日の<br />家事</button>
        <button className="choreBtn" onClick={openSuggest}>家事<br />提案</button>
        <button className="choreBtn" onClick={() => { setSettingChore(null); setOpenModal("list"); }}>家事<br />リスト</button>
    </div>

    {/* ===== 今日の家事モーダル ===== */}
    {openModal === "today" && (
        <>
            <div className="overlay" onClick={() => setOpenModal(null)}></div>
            <div className="modal">
                <h2 className="modalTitle">今日の家事</h2>
                <p>ここに家事が入ります</p>
                <button className="confirmBtn" onClick={() => setOpenModal(null)}>確定</button>
            </div>
        </>
    )}

    {/* ===== 家事提案モーダル ===== */}
    {openModal === "suggest" && (
        <>
            <div className="overlay" onClick={() => setOpenModal(null)}></div>
            <div className="modal">
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

                        <button className="outlineBtn" onClick={handleSuggest}>確定</button>
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

                        <div className="resultArea">
                            <div className="resultItem">
                                <p className="resultTime">10分</p>
                                <p className="resultName">掃除機</p>
                            </div>
                            <div className="resultItem">
                                <p className="resultTime">20分</p>
                                <p className="resultName">お風呂掃除</p>
                            </div>
                        </div>

                        <label className="checkLabel">
                            <input type="checkbox" />
                            今日の家事に追加する
                        </label>

                        <button className="outlineBtn" onClick={() => setOpenModal(null)}>終了</button>
                    </>
                )}
            </div>
        </>
    )}

    {/* ===== 家事リストモーダル ===== */}
    {openModal === "list" && (
        <>
            <div className="overlay" onClick={() => setOpenModal(null)}></div>
            <div className="modal">
                <h2 className="modalTitle">家事リスト</h2>

                {/* 一覧 */}
                {settingChore === null && (
                    <>
                        <div className="listArea">
                            {["掃除機", "お風呂掃除", "洗濯", "洗い物", "トイレ掃除"].map(name => (
                                <div className="listRow" key={name} onClick={() => setSettingChore(name)}>
                                    <span>{name}</span>
                                    <span className="arrow">›</span>
                                </div>
                            ))}
                        </div>
                        <button className="confirmBtn" onClick={() => setOpenModal(null)}>確定</button>
                    </>
                )}

                {/* 設定画面 */}
                {settingChore !== null && (
                    <>
                        <h3 className="settingTitle">{settingChore} -設定-</h3>

                        <div className="settingItem">
                            <p className="label">家事を行う頻度</p>
                            <select className="select">
                                <option>毎日</option>
                                <option>2日に1回</option>
                                <option>週1回</option>
                            </select>
                        </div>

                        <div className="settingItem">
                            <p className="label">家事忘れ防止通知</p>
                            <select className="select">
                                <option>ON</option>
                                <option>OFF</option>
                            </select>
                        </div>

                        <div className="settingItem">
                            <p className="label">マイ家事登録</p>
                            <select className="select">
                                <option>する</option>
                                <option>しない</option>
                            </select>
                        </div>

                        <button className="confirmBtn" onClick={() => {
                            setAlert(true);
                            setSettingChore(null);
                            setTimeout(() => setAlert(false), 2000);
                        }}>確定</button>
                    </>
                )}
            </div>
        </>
    )}

    {/* アラート */}
    {alert && (
        <div className="alertBox">● 設定が完了しました。</div>
    )}

</div>
    )
}

export default ChoreList;