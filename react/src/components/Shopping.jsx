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

        axios.get("/api/shopping/latest")
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

    const deleteItem = (index) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    }

    const saveShopping = () => {

        for (let i = 0; i < items.length; i++) {

        if (items[i].itemName.trim() === "") {
        alert("商品名を入力してください");
        return;
        }
    
    }
         axios.post("/api/shopping",items
         )
         .then(() => {
            alert("買い物リストを作成しました");
         })
         .catch((error) => {
            console.log(error);
         });
    };

    return(
    <div className="screen">
        <h2>買い物リスト作成</h2>

        <div className="shopping-list">

        {/*itemsの中身を1件ずつ取り出す*/}
        {items.map((item,index) => (
            <div className="item-input" key={index}>

                <span>・</span>
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

                <button
                 className="delete-button"
                 onClick={() => deleteItem(index)}
                 >
                ✖
                </button>

            </div>
        ))}

        <button className="add-button" onClick={addItem}>+</button>

        </div>

        <button className="save-button" onClick={saveShopping}>作成</button>

    </div>
    );
}

export default Shopping