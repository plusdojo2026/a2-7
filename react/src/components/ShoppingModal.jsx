import { useEffect, useState } from "react";
import axios from "axios";
import "../css/ShoppingModal.css";

//モーダル表示

//一覧の商品情報を受け取る
function ShoppingModal({ items, closeModal, reload }) {
    const [shoppingItems, setShoppingItems] = useState([]);

    useEffect(() => {
        setShoppingItems(items);
    }, [items]);

    const changeBought = (index) => {
         const newItems = [...shoppingItems];

         if(newItems[index].isBought === 0) {
            newItems[index].isBought = 1;
         }else{
            newItems[index].isBought = 0;
         }

         setShoppingItems(newItems);
    }

    const updateItems = () => {

        shoppingItems.map((item) => {

            axios.put(
                "http://localhost:8080/shopping/item/" + item.shoppingItemId,
                {
                    isBought: item.isBought
                }
            );
        });

        alert("購入状況を更新しました");
        reload();
        closeModal();
    };

     return (
        <div className="modal-overlay">

            <div className="modal">

            <h2>購入状況確認</h2>

            {shoppingItems.map((item, index) => (
                <div 
                className="item-row"
                key={item.shoppingItemId}>

                    <span>
                        {item.itemName}
                    </span>

                    <input
                    type="checkbox"
                    checked={item.isBought === 1}
                    onChange={() => changeBought(index)}
                    />
                </div>
            ))}

            <button onClick={updateItems} className="update-button">
                更新
            </button>

            <button onClick={closeModal} className="close-button">
                閉じる
            </button>

        </div>
    
    </div>

    );
}

export default ShoppingModal;