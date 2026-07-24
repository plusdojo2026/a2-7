{/*商品入力画面*/}
import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Shopping.css";

function Shopping() {

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

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

        if (items.length === 1) {
            return;
        }
        
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    }

    const saveShopping = () => {

        for (let i = 0; i < items.length; i++) {

        if (items[i].itemName.trim().length < 1) {
        setAlertMessage("商品名を入力してください");
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
         }, 2000);
         
        return;
        }
    
    }
         axios.post("/api/shopping",items
         )
         .then(() => {
          setAlertMessage("買い物リストを作成しました");
          setShowAlert(true);

           setTimeout(() => {
            setShowAlert(false);
         }, 2000);
         

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

    {showAlert && (
        <div className="alert">

            <p><span className="dot">●</span>   {alertMessage}</p>

        </div>
    )}

    </div>
    );
}

export default Shopping