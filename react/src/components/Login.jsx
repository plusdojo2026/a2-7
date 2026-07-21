import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../css/Login.css";

function Login() {
    const [rememberPassword, setRememberPassword] = useState(false);
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        const savedUserId = localStorage.getItem("userId");
        const savedPassword = localStorage.getItem("password");
        const savedRemember = localStorage.getItem("rememberPassword");
        if (savedRemember === "true") {

            setUserId(savedUserId);
            // setPassword(savedPassword);
            setRememberPassword(true);

        }
    }, []);
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

                if (rememberPassword) {
                    localStorage.setItem("userId", userId);
                    // localStorage.setItem("password", password);
                    // localStorage.setItem("rememberPassword", "true");
                } else {
                    localStorage.removeItem("userId");
                    // localStorage.removeItem("password");
                    // localStorage.removeItem("rememberPassword");
                }
                navigate("/home");
            } else {
                alert("IDまたはパスワードが違います");

            }


        } catch (err) {

            console.error(err);

        }

    };
    const reset = () => {
        setUserId("");
        setPassword("");
        setRememberPassword(false);
    };
    return (
        <div className="login">

            <h1>
                <div>Sign</div>
                <div>in</div>
            </h1>

            <input
                type="text"
                placeholder="ユーザーID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            /><br />

            <input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            /><br />
            <label>
                <input
                    type="checkbox"
                    checked={rememberPassword}
                    onChange={(e) => setRememberPassword(e.target.checked)}
                />
                ユーザーIDを記憶する
            </label>
            <div>
                <button onClick={reset}>リセット</button>
                <button onClick={login}>ログイン</button>
            </div>

            <Link to="/register">
                新規登録＞
            </Link>
        </div>

    );
}

export default Login;