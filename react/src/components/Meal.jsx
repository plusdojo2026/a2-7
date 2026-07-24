import { useEffect, useRef, useState } from 'react';
import '../css/Meal.css'
import axios from "axios";


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
    //ページ切り替え
    let [page, setPage] = useState(0);

    //セッション
    let isRedirectingRef = useRef(false);
    let sessionError =()=>{
        if(isRedirectingRef.current){
            return;
        }
        isRedirectingRef.current = true;
        alert("セッションがきれました。再ログインしてください");
        window.location.href ="/login";
    }

    //初回表示時に食事一覧を取得
    useEffect(() => {
        refreshMealList();
    }, [page, filterMealType]);
    let refreshMealList = () =>{

        let url;

        if(filterMealType === ""){
            url = `/api/meal/?page=${page}`;
        }else{
            url = `/api/meal/type/?mealType=${filterMealType}&page=${page}`;
        }

        fetch(url)

        .then(response => {
            if(response.status === 401){
                sessionError();
                return;
            }
            if(!response.ok){
                throw new Error();
            }
            return response.json();
        })
        .then(json => setMeals(json))
        .catch(error =>{
            console.log(error);
            alert("一覧の取得に失敗しました。")
        });
    }


    //登録
    //入力フォームの値をnewMealに保存(reactのstateに保存)
    let inputNewMeal = (e) => {
        if(e.target.name === "mealImage"){
            setNewMeal({...newMeal, mealImage:e.target.files[0]});
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
        //setMeals([...meals, newMeal]);
        let formData = new FormData();

        formData.append("recipeTitle", newMeal.recipeTitle);
        formData.append("recordDate", newMeal.recordDate);
        formData.append("mealType", newMeal.mealType);
        formData.append("url", newMeal.url);
        formData.append("recipeMemo", newMeal.recipeMemo);

        formData.append("image", newMeal.mealImage);

        console.log(newMeal);
        axios.post(
            "/api/meal/regist/",
            formData
        )

        .then(response =>{
            refreshMealList();
            setMessage("記録しました");
            setTimeout(() => {setMessage("");},3000);
        
            setNewMeal({recipeTitle:'', mealImage:'', recordDate:'', url:'', recipeMemo:'',mealType:''});//入力フォームを空欄に
            setShowRegistModal(false);
        })
        .catch(error =>{
            console.log(error);

            if(error.response?.status === 401){
                sessionError();
                return;
            }

            if(error.response?.status === 413){
                alert("画像サイズが大きすぎます");
                return;
            }
            alert("登録に失敗しました。")
        });
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
    //モーダル内の食事情報(更新内容)を保存(reactのstateに保存)
    let inputSelectedMeal = (e) => {
        if(e.target.name === "mealImage"){
            setSelectedMeal({...selectedMeal, mealImage:e.target.files[0]});
        }else{
            setSelectedMeal({ ...selectedMeal, [e.target.name]: e.target.value });
        }
    }

    //更新
    let updateMeal = () => {

        let formData = new FormData();

        formData.append("mealId", selectedMeal.mealId);
        formData.append("recipeTitle", selectedMeal.recipeTitle);
        formData.append("recordDate", selectedMeal.recordDate);
        formData.append("mealType", selectedMeal.mealType);
        formData.append("url", selectedMeal.url);
        formData.append("recipeMemo", selectedMeal.recipeMemo);
        
        if(selectedMeal.mealImage instanceof File){ // 画像が選択されている場合だけ送信
            formData.append("image", selectedMeal.mealImage);
        }

        axios.post(
        "/api/meal/update/",
        formData
        )
        .then(response => {
            refreshMealList();

            setMessage("更新しました");

            setTimeout(() => {
            setMessage("");
            }, 3000);

            setShowUpdateModal(false);
        })
        .catch(error =>{
            console.log(error);

            if(error.response?.status === 401){
                sessionError();
                return;
            }

            if(error.response?.status === 413){
                alert("画像サイズが大きすぎます");
                return;
            }
            alert("更新に失敗しました。")
        });
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

    //朝昼夜ボタンでの絞り込み状態をstateに保存
    let toggleMealType = (mealType) =>{

        setPage(0);

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
                    <button className="cloudyBtn" onClick={() => toggleMealType("朝")}>
                        <img src={filterMealType ==="朝" ?"/img/cloudy_active.png" :"/img/cloudy.png"}/>
                    </button>
                    <button className="sunBtn" onClick={() => toggleMealType("昼")}>
                        <img src={filterMealType ==="昼" ?"/img/sun_active.png" :"/img/sun.png"}/>
                    </button>
                    <button className="moonBtn" onClick={() => toggleMealType("夜")}>
                        <img src={filterMealType ==="夜" ?"/img/moon_active.png" :"/img/moon.png"}/>
                    </button>
            </div>

            {/* 新規作成ボタン→クリックすると新規作成モーダルが展開*/}
            <div className="create">
                <button onClick={() => setShowRegistModal(true)} id="createBtn">新規作成</button>
            </div>

            {/* 食事一覧の表示 */}
            {meals.length === 0 && page === 0 && filterMealType === "" ?(
                    <div className="emptyMessage">
                        食事記録がありません。<br/>
                        新規作成から登録してみましょう！
                    </div>
            )
            :
            (<>
                    {meals.map((meal) =>(
                        <div key={meal.mealId} className="mealCard" onClick={() => openUpdateModal(meal)}>
                            <div className="mealTitle" id="mealtitle"><strong>{meal.recipeTitle}</strong></div>
                            <div className="mealImage">
                                <img src= {`http://localhost:8080/uploads/${meal.mealImage}` }/>
                            </div>
                            <div id="mealinformation">
                                <div className="mealdate"><b>日付</b>：{meal.recordDate}</div>
                                <div className="url"><b>URL</b>：{meal.url}</div>
                                <div className="recipe"><b>レシピ</b>：{meal.recipeMemo}</div>
                            </div>
                        </div>
                    ))}

                {/* ページング */}
                {meals.length > 0 &&(
                    <div className='paging'>
                        <button onClick={() => setPage(page-1)} disabled={page ===0 }>
                            <img src={page === 0 ? "/img/left_gray.png" :"/img/leftBtn.png"}/>
                        </button>
                        <span>{page +1}</span>
                        <button onClick={() => setPage(page+1)} disabled={meals.length<5}>
                            <img src={meals.length<5 ?"/img/right_gray.png" :"/img/rightBtn.png"}/>
                        </button>                 
                    </div>
                )}
                    </>
                    
            )}

             {/* 新規作成モーダル */}
            {showRegistModal &&
                <div className="overlay">
                    <div id="newRegistModal">
                        <div className='modalHeader'>
                            <div className='title'>新規作成<br /></div>
                            <button onClick={() => setShowRegistModal(false)} id="registCancelButton">×</button><br />
                        </div>
                        <div className='formArea'>
                            <span className='backcolor'>タイトル：</span><input type ="text" name="recipeTitle" value={newMeal.recipeTitle} onChange={inputNewMeal}/><br />
                            <span className='backcolor'><span className='red'>(必須)</span>画像ファイル：</span><input type ="file" name="mealImage" onChange={inputNewMeal}/><br />
                            <span className='backcolor'><span className='red'>(必須)</span>日付：</span><input type ="date" name="recordDate" value={newMeal.recordDate} onChange={inputNewMeal}/><br />
                            <span className='backcolor'>参考URL：</span><input type ="text" name="url" value={newMeal.url} onChange={inputNewMeal}/><br />
                            <span className='backcolor'>レシピ：</span><textarea name="recipeMemo" value={newMeal.recipeMemo} onChange={inputNewMeal}/><br />
                            <div className="charCount">
                                {newMeal.recipeMemo.length}/255文字
                            </div>
                            <div className="mealtype">
                                <button type="button" className="cloudyBtn" onClick={()=> selectMealType("朝")}>
                                    <img src={newMeal.mealType ==="朝" ?"/img/cloudy_active.png" :"/img/cloudy.png"}/>
                                </button>
                                <button type="button" className="sunBtn" onClick={()=> selectMealType("昼")}>
                                    <img src={newMeal.mealType ==="昼" ?"/img/sun_active.png" :"/img/sun.png"}/>
                                </button>
                                <button type="button" className="moonBtn" onClick={()=> selectMealType("夜")}>
                                    <img src={newMeal.mealType ==="夜" ?"/img/moon_active.png" :"/img/moon.png"}/>
                                </button>
                            </div>
                        </div>
                        <button onClick={registMeal} id='registButton'>記録</button>
                    </div>
                </div>   
            }

             {/* 更新モーダル */}
            {showUpdateModal &&
                <div className="overlay">
                    <div id="updateModal">
                        <div className='modalHeader'>
                            <div className='title'>編集<br /></div>
                            <button  onClick={() => setShowUpdateModal(false)} id="updateCancelButton">×</button><br />
                        </div>
                        <div className='formArea'>
                            <span className='backcolor'>タイトル：</span><input type ="text" name="recipeTitle" value={selectedMeal.recipeTitle} onChange={inputSelectedMeal}/><br />
                            <span className='backcolor'>画像ファイル：</span><input type ="file" name="mealImage" onChange={inputSelectedMeal}/><br />
                            <span className='backcolor'>日付：</span><input type ="date" name="recordDate"value={selectedMeal.recordDate}  onChange={inputSelectedMeal}/><br />
                            <span className='backcolor'>参考URL：</span><input type ="text" name="url" value={selectedMeal.url} onChange={inputSelectedMeal}/><br />
                            <span className='backcolor'>レシピ：</span><textarea name="recipeMemo" value={selectedMeal.recipeMemo} onChange={inputSelectedMeal}/><br />
                            <div className="charCount">
                                {selectedMeal.recipeMemo.length}/255文字
                            </div>
                            <div className="mealtype">
                                <button className="cloudyBtn" onClick={()=> selectUpdateMealType("朝")}>
                                    <img src={selectedMeal.mealType ==="朝" ?"/img/cloudy_active.png" :"/img/cloudy.png"}/>
                                </button>
                                <button className="sunBtn" onClick={()=> selectUpdateMealType("昼")}>
                                    <img src={selectedMeal.mealType ==="昼" ?"/img/sun_active.png" :"/img/sun.png"}/>
                                </button>
                                <button className="moonBtn" onClick={()=> selectUpdateMealType("夜")}>
                                    <img src={selectedMeal.mealType ==="夜" ?"/img/moon_active.png" :"/img/moon.png"}/>
                                </button>
                            </div>
                        </div>
                        <button onClick={updateMeal} id="updateButton">更新</button>
                    </div>
                </div>
            }


        </div>
    );
};
export default MealComponent;