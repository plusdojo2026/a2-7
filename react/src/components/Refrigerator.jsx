import { useState, useEffect } from 'react';
import axios from 'axios';

function Refrigerator(){

{/*食材と日用品を取得する空の箱*/}
const [foods, setFoods] = useState([]);
const [items, setItems] = useState([]);

{/*タブ*/}
const [tab, setTab] = useState("food");

{/*画面が表示されたら一度だけ実行する*/}
useEffect(() => {

    //Spring Bootの@GetMapping("/api/food_stock/")を呼ぶ
    axios.get("http://localhost:8080/api/food_stock/")
    //Spring Bootで返したデータをres.dataに入れsetFoodsでfoodsに保存
        .then(res => {
            setFoods(res.data);
        });

}, []);

 return (

        <div>

             {/* タイトル */}
            <h1>冷蔵庫</h1>

            {/* タブ（冷蔵庫・日用品） */}
        

        {/* 冷蔵庫の背景画像 */}

         {/* 日用品倉庫画像 */}
        

        {/* 食材一覧を表示 */}
           {foods.map(food => (

    <div key={food.stockFoodId}>
        <p>{food.stockFoodName}</p>
    </div>

))}

            {/* 日用品一覧 */}

            {/* ドロップエリア（冷蔵庫） */}
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {

                }}
            >

                冷蔵庫

            </div>

            {/* ゴミ箱 */}

        </div>

    );
}
export default Refrigerator;