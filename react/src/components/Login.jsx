import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/Login.css";

function Login() {
    const [rememberPassword, setRememberPassword] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        const savedUserName = localStorage.getItem("userName");
        const savedPassword = localStorage.getItem("password");
        const savedRemember = localStorage.getItem("rememberPassword");
        if (savedRemember === "true") {

            setUserName(savedUserName);
            // setPassword(savedPassword);
            setRememberPassword(true);

        }
    }, []);
    const login = async () => {

        try {

            const response = await axios.post(
                "/api/login",
                {
                    userName: userName,
                    password: password
                }
            );



            if (response.data) {

                // ログイン成功

                if (rememberPassword) {
                    localStorage.setItem("userName", userName);
                    // localStorage.setItem("password", password);
                    // localStorage.setItem("rememberPassword", "true");
                } else {
                    localStorage.removeItem("userName");
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
        setUserName("");
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
                placeholder="ユーザー名"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            /><br />

            <div className="password-area">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="button"
                    className="eye-button"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            <br />

            <label>
                <input
                    type="checkbox"
                    checked={rememberPassword}
                    onChange={(e) => setRememberPassword(e.target.checked)}
                />
                ユーザー名を記憶する
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