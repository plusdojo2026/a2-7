//買い物リスト一覧表示画面

import { useEffect,useState } from "react";
import axios from "axios";
import ShoppingModal from "./ShoppingModal";

function ShoppingList() {

    const [Lists, setLists] = useState([]);
    const [items, setItems] = useState([]);
    //モーダル表示するかどうかの関数
    const [showModal, setShowModal] = useState(false);

    //指定された買い物リストの商品を取得する
    const getItems = (ShoppingListid) => {

        axios.get("http://localhost:8080/shopping/item/" + ShoppingListid)
        .then((response) => {

             setItems(response.data);

             setShowModal(true);

        })
        .catch((error) => {

            console.log(error);

        });
    };

    useEffect(() => {

        axios.get("http://localhost;8080/shopping/list")
        .then((response) => {

             setLists(response.data);
        })
        .catch((error) => {

             console.log(error);
        });

    },[]);

    return (
        <>
            <h2>買い物リスト一覧</h2>

            {Lists.map((list) => (
                <div key={list.ShoppingListid}

                    //リストをクリックしたらそのリストの商品を取得する
                     onClick={() => getItems(list.ShoppingListid)}>

                    <p>
                        作成日：{list.createDate}
                    </p>

                    {items.map((item) => (
                        <p key={item.shoppingItemId}>
                            {item.itemName}

                            {item.isBought === 0
                                ? "未購入"
                                : "購入済"}
                        </p>

                    ))}
                    
                    {showModal && (
                        <ShoppingModal
                            items={items}
                            closeModal={() => setShowModal(false)}
                        />
                    )}

                </div>
            ))}
        </>
    );
}

export default ShoppingList;