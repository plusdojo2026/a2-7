function Home(){
    return(
        <div className="home">

    {/* タブ */}
    <div className="menu">
        <button>お知らせ</button>
        <button className="active">ホーム</button>
        <button>家事</button>
    </div>

    {/* ポイント */}
    <div className="point">
        <p>現在の米粒ポイント</p>
        <h1>3</h1>
    </div>

    {/* 買い物リスト */}
    <button className="shoppingBtn">
        買い物リストを作成
    </button>

    {/* ボタン */}
    <div className="buttonArea">
        <button>ゴミルール設定</button>
        <button>アプリについて</button>
        <button>今日の曲</button>
    </div>

    {/* 豆知識 */}
    <div className="tips">
        tips
    </div>

    {/* 米キャラクター */}
    <div className="rice">
        <img src={riceImage} alt="米" />
    </div>

</div>
    )
}