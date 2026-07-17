import { useState } from "react";
import axios from "axios";
//import "../css/Login.css";

function Login({ setPage }) {

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {

        try {

            const response = await axios.post(
                "/api/login",
                {
                    userId: userId,
                    password: password
                }
            );


            if (response.data) {

                // ログイン成功
                setPage("home");

            } else {

                alert("IDまたはパスワードが違います");

            }


        } catch (err) {

            console.error(err);

        }

    };

    return (
        <div className="login">

            <h1>ログイン</h1>

            <input
                type="text"
                placeholder="ユーザーID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />

            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={login}>
                ログイン
            </button>

        </div>
    );
}

export default Login;