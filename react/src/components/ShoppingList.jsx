//買い物リスト一覧表示画面

import { useEffect,useState } from "react";
import axios from "axios";
import ShoppingModal from "./ShoppingModal";
import "../css/ShoppingList.css";

function ShoppingList() {

    //買い物リスト一覧
    const [Lists, setLists] = useState([]);

    //モーダルに表示する商品
    const [items, setItems] = useState([]);

    //モーダル表示状態
    const [showModal, setShowModal] = useState(false);

    //買い物リスト一覧を取得する
    const getShoppingLists = () => {
         axios.get("/api/shopping/list/")
         .then((response) => {

            console.log(response.data);
            setLists(response.data);
         })

         .catch((error) => {

            console.log(error);
         });
    };

    //画面表示時に一覧取得
    useEffect(() => {
        getShoppingLists();

    }, []);

    //クリックされたリストの商品取得
    const getItems = (shoppingListId) => {

        axios.get(
            "/api/shopping/item/" + shoppingListId
        )
        .then((response) => {

            setItems(response.data);

            setShowModal(true);
        })
        .catch((error) => {

            console.log(error);
         });
    };

    return (
        <div className="screen">

            <h2>買い物リスト一覧</h2>

            {Lists.map((list) => (

                <div className="list-card"
                     key={list.shoppingListid}
                     onClick={() => getItems(list.shoppingListid)}>

                    <h3>{list.createDate}</h3>

                  {list.items?.map((item) => (
                    <div className="item"
                         key={item.shoppingItemId}>

                    <span className="item-name">
                    ・ {item.itemName}
                    </span>

                    <span className={
                    item.isBought === 0
                    ? "not-bought"
                    : "bought"}
                    >

                    {item.isBought === 0
                    ? "✖"
                    : "✔"}

                    </span>
                    </div>

                    ))}

                </div>

            ))}

            {showModal && (
                <ShoppingModal
                  items={items}
                  closeModal={() => setShowModal(false)}
                  reload={getShoppingLists}
                 />
             )}

        </div>
    );
}

export default ShoppingList