import { useNavigate } from "react-router-dom";
import "../css/Top.css";

function Top() {

    const navigate = useNavigate();

    return (
        <div className="top">

            <h1>
                WELCOME
            </h1>

            <p>
                毎日の暮らしを<br />
                もっと便利に
            </p>


            <button
                onClick={() => navigate("/login")}
            >
                NEXT
            </button>


        </div>
    );
}

export default Top;