import { useState } from "react";
import Shopping from "./Shopping";
import ShoppingList from "./ShoppingList";
import "../css/ShoppingContainer.css"

function ShoppingContainer() {
    const [page, setPage] = useState("shopping");

    return (
        <>
        <header className="header">

            <button
             className={page === "shopping" ? "active" : ""}
             onClick={() => setPage("shopping")}>
            作成
            </button>

            <button
             className={page === "list" ? "active" : ""}
             onClick={() => setPage("list")}>
            一覧
            </button>

        </header>

        {page === "shopping" && <Shopping />}
        {page === "list" && <ShoppingList />}

        </>
    );
}

export default ShoppingContainer;