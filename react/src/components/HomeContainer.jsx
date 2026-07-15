import { useState } from "react";
import Home from "./Home";
import Notice from "./Notice";
//import Chores from "./Chores";

function HomeContainer() {

    const [page, setPage] = useState("home");

    return (
        <div className="homeContainer">

            {/* タブ */}
            <div className="menu">
                <button onClick={() => setPage("notice")}>
                    お知らせ
                </button>

                <button onClick={() => setPage("home")}>
                    ホーム
                </button>

                <button onClick={() => setPage("chores")}>
                    家事
                </button>
            </div>


            {/* 画面切替 */}
            {page === "home" && <Home />}

            {page === "notice" && <Notice />}

            {/* {page === "chores" && <Chores />} */}

        </div>
    );
}

export default HomeContainer;