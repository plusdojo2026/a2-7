import { useNavigate } from "react-router-dom";
import sinmai from "../assets/sinmai.png";
import "../css/Top.css";

function Top() {

    const navigate = useNavigate();

    return (
        <div className="top">
            <img
                src={sinmai}
                alt="新米"
                className="topImage"
            />
            <h1>
                WELCOME!
            </h1>




            <div className="nextArea">

                <button
                    onClick={() => navigate("/login")}
                >
                    NEXT
                </button>

            </div>


        </div>
    );
}

export default Top;