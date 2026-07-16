import { useState } from 'react';
import '../css/Meal.css'


const MealComponent = () =>{
    //モーダルウィンドウ
    //記録用モーダルウィンドウ→falseなので最初は表示されない
    let [showRegistModal, setShowRegistModal] = useState(false);
    //編集用モーダルウィンドウ→falseなので最初は表示されない
    let [showUpdateModal, setShowUpdateModal] = useState(false);
    //登録
    let [newMeal, setNewMeal] = useState({title:'', mealImg:'', date:'', url:'', recipe:''});

    //入力フォームの値をnewMealに保存(reactのstateに保存)
    let inputNewMeal = (e) => {
        setNewMeal({ ...newMeal, [e.target.name]: e.target.value });
    }

    //新しい食事データを登録
    let registMeal = () => {
        console.log(newMeal);
    };


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
            <div className="createBtn">
                <button onClick={() => setShowRegistModal(true)}>新規登録</button>
            </div>

            {/* 食事一覧の表示 */}
            <div className="mealCard" onClick={() => setShowUpdateModal(true)}>
                <div className="mealImage">画像</div>
                <div className="mealdate">日付：</div>
                <div className="url">URL：</div>
                <div className="recipe">レシピ：</div>
            </div>

             {/* 新規作成モーダル */}
            {showRegistModal &&
                <div className="newRegistModal">
                    <button onClick={() => setShowRegistModal(false)}>×</button><br />
                    新規作成<br />
                    タイトル：<input type ="text" name="title" value={newMeal.title} onChange={inputNewMeal}/><br />
                    ＊必須＊画像ファイル:<input type ="file" name="mealImg" value={newMeal.mealImg} onChange={inputNewMeal}/><br />
                    ＊必須＊日付:<input type ="date" name="date" value={newMeal.date} onChange={inputNewMeal}/><br />
                    参考URL：<input type ="text" name="url" value={newMeal.url} onChange={inputNewMeal}/><br />
                    レシピ：<input type ="text" name="recipe" value={newMeal.recipe} onChange={inputNewMeal}/><br />
                    <div className="mealtype">
                        <button>朝</button>
                        <button>昼</button>
                        <button>夜</button>
                    </div>
                    <button onClick={registMeal}>記録</button>
                </div>
            }

             {/* 更新モーダル */}
            {showUpdateModal &&
                <div className="updateModal">
                    <button  onClick={() => setShowUpdateModal(false)}>×</button><br />
                    編集<br />
                    タイトル：<input type ="text" name="date"/><br />
                    画像ファイル:<input type ="file" name="mealImg"/><br />
                    日付:<input type ="date" name="date"/><br />
                    参考URL：<input type ="text" name="url"/><br />
                    レシピ：<input type ="text" name="recipe"/><br />
                    <div className="mealtype">
                        <button>朝</button>
                        <button>昼</button>
                        <button>夜</button>
                    </div>
                    <button>更新</button>
                </div>
            }


        </div>
    );
};
export default MealComponent;