import { useEffect, useState } from 'react';
import '../css/Meal.css'



const MealComponent = () =>{
    //モーダルウィンドウ
    //記録用モーダルウィンドウ→falseなので最初は表示されない
    let [showRegistModal, setShowRegistModal] = useState(false);
    //編集用モーダルウィンドウ→falseなので最初は表示されない
    let [showUpdateModal, setShowUpdateModal] = useState(false);
    //登録
    let [newMeal, setNewMeal] = useState({recipeTitle:'', mealImage:'', recordDate:'', url:'', recipeMemo:'',mealType:''});
    let [meals, setMeals] = useState([]);
    //編集：一件クリックしたらそのデータをsetSlectedMealに保存しておく
    let [selectedMeal, setSelectedMeal] = useState({recipeTitle:'', mealImage:'', recordDate:'', url:'', recipeMemo:'',mealType:''});
    //記録アラート
    let[message, setMessage] = useState("");
    //絞り込み(朝昼夜ボタン)
    let [filterMealType, setFilterMealType] = useState("");

    //初回表示時に食事一覧を取得
    useEffect(() => {
        refreshMealList();
    }, []);
    let refreshMealList = () =>{
        fetch('/api/meal/')
        .then(response => response.json())
        .then(json => setMeals(json));
    }


    //登録
    //入力フォームの値をnewMealに保存(reactのstateに保存)
    let inputNewMeal = (e) => {
        if(e.target.name === "mealImage"){
            setNewMeal({...newMeal, mealImage:e.target.files[0].name});
        }else{
            setNewMeal({ ...newMeal, [e.target.name]: e.target.value });
        }
    }
    //新しい食事データを登録
    let registMeal = () => {
        if(newMeal.mealImage === "" || newMeal.recordDate === ""){
            alert("画像と日付は必須です");
            return;
        }
        setMeals([...meals, newMeal]);
        console.log(newMeal);

        setMessage("記録しました");
        setTimeout(() => {setMessage("");},3000);
    
        setNewMeal({recipeTitle:'', mealImage:'', recordDate:'', url:'', recipeMemo:'',mealType:''});//入力フォームを空欄に
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
        if(e.target.name === "mealImage"){
            setSelectedMeal({...selectedMeal, mealImage:e.target.files[0].name});
        }else{
            setSelectedMeal({ ...selectedMeal, [e.target.name]: e.target.value });
        }
    }

    //更新
    let updateMeal = () =>{
        let updateMeals = meals.map((meal) => meal.mealId === selectedMeal.mealId ? selectedMeal : meal);

        setMessage("更新しました");
        setTimeout(() => {setMessage("");},3000);

        setMeals(updateMeals); //mealsの中身をupdatedMealsに書き換え
        setShowUpdateModal(false);
    }
    let selectUpdateMealType = (mealType) =>{
        setSelectedMeal({ ...selectedMeal, mealType:mealType });
    }

    //並び替え(新しい順と古い順)
    let sortMeal = (sortType) =>{
        let sortedMeals = [...meals];

        if(sortType === "new"){
            sortedMeals.sort(
                (a,b) => new Date(b.recordDate)- new Date(a.recordDate)
            );
        }

        if(sortType === "old"){
            sortedMeals.sort(
                (a,b) => new Date(a.recordDate)- new Date(b.recordDate)
            );
        }
        
        setMeals(sortedMeals);
    }

    //朝昼夜ボタンでの絞り込み
    let toggleMealType = (mealType) =>{
        if(filterMealType === mealType){
            setFilterMealType("");
        }else{
            setFilterMealType(mealType);
        }
    }



    return(
        <div className="mealContents">
            {message && <div className='message'>{message}</div>}

            {/* 絞り込み */}
            <div className="filter">
                <select onChange={(e) => sortMeal(e.target.value)}>
<option value="" disabled>並び替え</option>
<option value="new">新しい順</option>
<option value="old">古い順</option>
</select>
    
                    <button onClick={() => toggleMealType("朝")}>朝</button>
                    <button onClick={() => toggleMealType("昼")}>昼</button>
                    <button onClick={() => toggleMealType("夜")}>夜</button>
            </div>

            {/* 新規作成ボタン→クリックすると新規作成モーダルが展開*/}
            <div className="createBtn">
                <button onClick={() => setShowRegistModal(true)}>新規登録</button>
            </div>

            {/* 食事一覧の表示 */}
            {/* `/uploads/${meal.mealImg}` */}
            {/*絞り込み条件が設定されていない、または食事の種類が絞り込み条件と一致している→trueで表示*/}
            {meals
            .filter(meal =>
                filterMealType === "" || meal.mealType ===filterMealType
            )
            .map((meal) =>
                <div key={meal.mealId} className="mealCard" onClick={() => openUpdateModal(meal)}>
                    <div className="mealImage">{meal.mealImage}</div>
                    <div className="mealTitle">{meal.recipeTitle}</div>
                    <div className="mealdate">日付：{meal.recordDate}</div>
                    <div className="url">URL：{meal.url}</div>
                    <div className="recipe">レシピ：{meal.recipeMemo}</div>
                </div>
            )
            }

             {/* 新規作成モーダル */}
            {showRegistModal &&
                <div className="newRegistModal">
                    <button onClick={() => setShowRegistModal(false)}>×</button><br />
                    新規作成<br />
                    タイトル：<input type ="text" name="recipeTitle" value={newMeal.recipeTitle} onChange={inputNewMeal}/><br />
                    ＊必須＊画像ファイル:<input type ="file" name="mealImage" onChange={inputNewMeal}/><br />
                    ＊必須＊日付:<input type ="date" name="recordDate" value={newMeal.recordDate} onChange={inputNewMeal}/><br />
                    参考URL：<input type ="text" name="url" value={newMeal.url} onChange={inputNewMeal}/><br />
                    レシピ：<input type ="text" name="recipeMemo" value={newMeal.recipeMemo} onChange={inputNewMeal}/><br />
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
                    タイトル：<input type ="text" name="recipeTitle" value={selectedMeal.recipeTitle} onChange={inputSelectedMeal}/><br />
                    画像ファイル:<input type ="file" name="mealImage" onChange={inputSelectedMeal}/><br />
                    日付:<input type ="date" name="recordDate"value={selectedMeal.recordDate}  onChange={inputSelectedMeal}/><br />
                    参考URL：<input type ="text" name="url" value={selectedMeal.url} onChange={inputSelectedMeal}/><br />
                    レシピ：<input type ="text" name="recipeMemo" value={selectedMeal.recipeMemo} onChange={inputSelectedMeal}/><br />
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