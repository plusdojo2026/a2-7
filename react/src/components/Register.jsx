import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../css/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();


    const register = async () => {

        if (
            userName.trim() === "" ||
            password.trim() === "" ||
            passwordConfirm.trim() === ""
        ) {
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
        if (password !== passwordConfirm) {
            alert("パスワードが一致しません");
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


            <div className="password-area">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="パスワード"
                    value={password}
                    minLength={8}
                    maxLength={20}
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
            <br/>
            <div className="password-area">

                <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="パスワード確認"
                    value={passwordConfirm}
                    minLength={8}
                    maxLength={20}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                />

                <button
                    type="button"
                    className="eye-button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>

            </div>

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