import { useState } from 'react';
import '../css/Meal.css'


const MealComponent = () =>{
    //モーダルウィンドウ
    //記録用モーダルウィンドウ→falseなので最初は表示されない
    let [showRegistModal, setShowRegistModal] = useState(false);
    //編集用モーダルウィンドウ→falseなので最初は表示されない
    let [showUpdateModal, setShowUpdateModal] = useState(false);
    //登録
    let [newMeal, setNewMeal] = useState({title:'', mealImg:'', date:'', url:'', recipe:'',mealType:''});
    let [meals, setMeals] = useState([]);
    //並び替え（プルダウンボタン）
    let [showSortMenu, setShowSortMenu] = useState(false);
    //一件クリックしたらそのデータをsetSlectedMealに保存しておく
    let [selectedMeal, setSelectedMeal] = useState({title:'', mealImg:'', date:'', url:'', recipe:'',mealType:''});

    

    //登録
    //入力フォームの値をnewMealに保存(reactのstateに保存)
    let inputNewMeal = (e) => {
        if(e.target.name === "mealImg"){
            setNewMeal({...newMeal, mealImg:e.target.files[0].name});
        }else{
            setNewMeal({ ...newMeal, [e.target.name]: e.target.value });
        }
    }
    //新しい食事データを登録
    let registMeal = () => {
        setMeals([...meals, newMeal]);
        console.log(newMeal);

        setNewMeal({title:'', mealImg:'', date:'', url:'', recipe:'',mealType:''});//入力フォームを空欄に
        setShowRegistModal(false);
    };
    //朝昼夜ボタン
    let selectMealType = (mealType) =>{
        setNewMeal({ ...newMeal, mealType:mealType});
    };

    //編集
    let openUpdateModal = (meal) =>{  //一件クリックしたら実行
        console.log(meal);
        setSelectedMeal(meal); //selectedMealに取得したデータを保存
        setShowUpdateModal(true);  //編集モーダルを開く
    }
    //モーダル内の食事情報(更新内容)をmodBookに保存(reactのstateに保存)
    let inputSelectedMeal = (e) => {
        setSelectedMeal({ ...selectedMeal, [e.target.name]: e.target.value });
    }

    //更新
    let updateMeal = () =>{
        let updateMeals = meals.map((meal) => meal.title === selectedMeal.title ? selectedMeal : meal);
        setMeals(updateMeals); //mealsの中身をupdatedMealsに書き換え
        setShowUpdateModal(false);
    }
    let selectUpdateMealType = (mealType) =>{
        setSelectedMeal({ ...selectedMeal, mealTpe:mealType });
    }



    return(
        <div className="mealContents">

            {/* 絞り込み */}
            <div className="filter">
                <button onClick={() =>setShowSortMenu(!showSortMenu)}>並び替え</button>
                {showSortMenu &&(
                    <div className='sortMenu'>
                        <button onClick={() => sortMeal("new")}>新しい順</button>
                        <button onClick={() => sortMeal("old")}>古い順</button>
                    </div>
                )}
                    <button >朝</button>
                    <button >昼</button>
                    <button >夜</button>
            </div>

            {/* 新規作成ボタン→クリックすると新規作成モーダルが展開*/}
            <div className="createBtn">
                <button onClick={() => setShowRegistModal(true)}>新規登録</button>
            </div>

            {/* 食事一覧の表示 */}
            {/* `/uploads/${meal.mealImg}` */}
            {meals.map((meal) =>
                <div key={meal.title} className="mealCard" onClick={() => openUpdateModal(meal)}>
                    <div className="mealImage">{meal.mealImg}</div>
                    <div className="mealTitle">{meal.title}</div>
                    <div className="mealdate">日付：{meal.date}</div>
                    <div className="url">URL：{meal.url}</div>
                    <div className="recipe">レシピ：{meal.recipe}</div>
                </div>
            )}

             {/* 新規作成モーダル */}
            {showRegistModal &&
                <div className="newRegistModal">
                    <button onClick={() => setShowRegistModal(false)}>×</button><br />
                    新規作成<br />
                    タイトル：<input type ="text" name="title" value={newMeal.title} onChange={inputNewMeal}/><br />
                    ＊必須＊画像ファイル:<input type ="file" name="mealImg" onChange={inputNewMeal}/><br />
                    ＊必須＊日付:<input type ="date" name="date" value={newMeal.date} onChange={inputNewMeal}/><br />
                    参考URL：<input type ="text" name="url" value={newMeal.url} onChange={inputNewMeal}/><br />
                    レシピ：<input type ="text" name="recipe" value={newMeal.recipe} onChange={inputNewMeal}/><br />
                    <div className="mealtype">
                        <button type="button" onClick={()=> selectMealType("朝")}>朝</button>
                        <button type="button" onClick={()=> selectMealType("昼")}>昼</button>
                        <button type="button" onClick={()=> selectMealType("夜")}>夜</button>
                    </div>
                    <button onClick={registMeal}>記録</button>
                </div>
            }

             {/* 更新モーダル */}
            {showUpdateModal &&
                <div className="updateModal">
                    <button  onClick={() => setShowUpdateModal(false)}>×</button><br />
                    編集<br />
                    タイトル：<input type ="text" name="title" value={selectedMeal.title} onChange={inputSelectedMeal}/><br />
                    画像ファイル:<input type ="file" name="mealImg"/><br />
                    日付:<input type ="date" name="date"value={selectedMeal.date}  onChange={inputSelectedMeal}/><br />
                    参考URL：<input type ="text" name="url" value={selectedMeal.url} onChange={inputSelectedMeal}/><br />
                    レシピ：<input type ="text" name="recipe" value={selectedMeal.recipe} onChange={inputSelectedMeal}/><br />
                    <div className="mealtype">
                        <button onClick={()=> selectUpdateMealType("朝")}>朝</button>
                        <button onClick={()=> selectUpdateMealType("昼")}>昼</button>
                        <button onClick={()=> selectUpdateMealType("夜")}>夜</button>
                    </div>
                    <button onClick={updateMeal}>更新</button>
                </div>
            }


        </div>
    );
};
export default MealComponent;