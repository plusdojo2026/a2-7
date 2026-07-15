import { useState } from "react";

function shopping() {

    const [items, setItems] = useState([
        {
            itemName: "",
            isBought: 0
        }
    ]);

    return(
    <>
        <h2>買い物リスト作成</h2>
    </>
    );
}
