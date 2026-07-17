import { useState } from "react";
import Home from "./Home";
import Notice from "./Notice";
import ChoreList from "./ChoreList";
import "../css/HomeContainer.css";
import Login from "./Login";
function HomeContainer() {

    const [page, setPage] = useState("login");

    return (
        <div className="homeContainer">

            {/* タブ */}
            <div className="menu">
                <button
                    className={page === "notice" ? "active" : ""}
                    onClick={() => setPage("notice")}
                >
                    お知らせ
                </button>

                <button
                    className={page === "home" ? "active" : ""}
                    onClick={() => setPage("home")}
                >
                    ホーム
                </button>

                <button
                    className={page === "chores" ? "active" : ""}
                    onClick={() => setPage("chores")}
                >
                    家事
                </button>
            </div>


            {/* 画面切替 */}
            {page === "login" && (
                <Login setPage={setPage} />
            )}
            {page === "home" && <Home />}

            {page === "notice" && <Notice />}

            {page === "chores" && <ChoreList />}

        </div>
    );
}

export default HomeContainer;