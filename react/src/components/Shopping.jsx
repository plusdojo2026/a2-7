{/*商品入力画面*/}
import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Shopping.css";

function Shopping() {

    const [items, setItems] = useState([
        {
            itemName: "",
            isBought: 0
        }
    ]);

useEffect(() => {

        axios.get("http://localhost:8080/shopping/latest")
        .then((response) => {

            if(response.data.length > 0){

                setItems(response.data);

            }
        })

        .catch((error) => {
             
            console.log(error);
        });

    },[]);


    {/*ボタンが押されたら実行する処理*/}
    const addItem = () => {
         const newItems = [...items];
         newItems.push({
            itemName: "",
            isBought: 0
         });

         setItems(newItems);
    };

    const saveShopping = () => {
         axios.post("http://localhost:8080/shopping",items)
         .then(() => {
            alert("買い物リストを作成しました");
         })
         .catch((error) => {
            console.log(error);
         });
    };

    return(
    <>
        <h2>買い物リスト作成</h2>

        <div className="shopping-list">

        {/*itemsの中身を1件ずつ取り出す*/}
        {items.map((item,index) => (
            <div className="item-input" key={index}>
                
                <input
                 type="text"
                 value={item.itemName}

                 //文字が変わるたびに処理が実行
                 onChange={(e) => {

                    const newItems = [...items];
                    newItems[index].itemName = e.target.value;
                    setItems(newItems);

                 }}
                />

            </div>
        ))}

        <button className="add-button" onClick={addItem}>+</button>

        </div>

        <button className="save-button" onClick={saveShopping}>作成</button>

    </>
    );
}

export default Shopping