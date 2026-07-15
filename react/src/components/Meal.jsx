const MealComponent = () =>{
    return(
        <div className="mealContents">

            {/* 絞り込み */}
            <div className="filter">
                <button>並び替え</button>
                <button>朝</button>
                <button>昼</button>
                <button>夜</button>
            </div>

            {/* 新規作成→クリックすると新規作成モーダルが展開*/}
            <div className="create">
                <button>新規登録</button>
            </div>

            {/* 食事一覧の表示 */}
            <div className="mealCard">
                <div className="mealImage">画像</div>
                <div className="mealdate">日付：</div>
                <div className="url">URL：</div>
                <div className="recipe">レシピ：</div>
            </div>

             {/* 新規作成モーダル */}
            <div className="newRegistModal">
                新規作成
                タイトル：<input type ="text" name="date"/><br />
                ＊必須＊画像ファイル:<input type ="file" name="mealImg"/><br />
                ＊必須＊日付:<input type ="date" name="date"/><br />
                参考URL：<input type ="text" name="url"/><br />
                レシピ：<input type ="text" name="recipe"/><br />
                <div className="mealtype">
                    <button>朝</button>
                    <button>昼</button>
                    <button>夜</button>
                </div>
                <button>記録</button>
            </div>

             {/* 更新モーダル */}
            <div className="updateModal">
                新規作成
                タイトル：<input type ="text" name="date"/><br />
                ＊必須＊画像ファイル:<input type ="file" name="mealImg"/><br />
                ＊必須＊日付:<input type ="date" name="date"/><br />
                参考URL：<input type ="text" name="url"/><br />
                レシピ：<input type ="text" name="recipe"/><br />
                <div className="mealtype">
                    <button>朝</button>
                    <button>昼</button>
                    <button>夜</button>
                </div>
                <button>更新</button>
            </div>


        </div>
    );
};
export default MealComponent;