import { useState, useEffect } from 'react';
import '/Refrigerator.css';
import axios from 'axios';

function Refrigerator(){

{/*食材と日用品を取得するからの箱*/}
const [foods, setFoods] = useState([]);
const [items, setItems] = useState([]);

{/*タブ*/}
const [tab, setTab] = useState("food");

{/*画面が表示されたら一度だけ実行する*/}
useEffect(() => {

    axios.get("http://localhost:8080/api/food_stock/")
        .then(res => {
            setFoods(res.data);
        });

}, []);

 return (

        <div>

            <h1>冷蔵庫</h1>

            {foods.map(food => (

                <img
                    key={food.stockFoodId}
                    src={"/image/" + food.stockFoodName + ".png"}
                    width="80"
                    draggable
                    onDragStart={(e) => {

                    }}
                />

            ))}

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {

                }}
            >

                冷蔵庫

            </div>

        </div>

    );
}
export default Refrigerator;