import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../css/Login.css";

function Register() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();


    const register = async () => {

        if (userName.trim() === "" || password.trim() === "") {
            alert("ユーザー名とパスワードを入力してください");
            return;
        }
        if (userName.length > 20) {
            alert("ユーザー名は20文字以内で入力してください");
            return;
        }

        if (password.length < 8 || password.length > 20) {
            alert("パスワードは8～20文字で入力してください");
            return;
        }
        try {

            const response = await axios.post(
                "/api/register",
                {
                    userName: userName,
                    password: password
                }
            );

            if (response.data) {

                alert("登録しました");
                navigate("/login");

            } else {

                alert("ユーザー名がすでに登録されています");

            }

        } catch (error) {

            console.error(error);

        }

    };




    return (
        <div className="login">

            <h1>
                New<br />
                account
            </h1>


            <input
                type="text"
                placeholder="ユーザー名"
                value={userName}
                maxLength={20}
                onChange={(e) => setUserName(e.target.value)}
            />


            <br />


            <input
                type="password"
                placeholder="パスワード"
                value={password}
                minLength={8}
                maxLength={20}
                onChange={(e) => setPassword(e.target.value)}
            />


            <div>

                <button onClick={register}>
                    登録
                </button>
            </div>
            <Link to="/login">
                ＜ログイン
            </Link>

        </div>
    );
}

export default Register;