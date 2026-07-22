import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Top from "./components/Top";
import Login from "./components/Login";
import Register from "./components/Register";
import HomeContainer from "./components/HomeContainer";
import Meal from "./components/Meal";
import Shopping from "./components/Shopping";
import ShoppingList from "./components/ShoppingList";
import Refrigerator from "./components/Refrigerator";
import ShoppingContainer from "./components/ShoppingContainer";
import Stock from "./components/Stock";
import BottomMenu from "./components/BottomMenu";
function Layout() {

    const location = useLocation();

    return (
        <>
            <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={<Top />} />
                <Route path="/home" element={<HomeContainer />} />

                <Route path="/meal" element={<Meal />} />

                <Route path="/shopping" element={<ShoppingContainer />} />

                <Route path="/stock" element={<Stock />} />

                <Route path="/refrigerator" element={<Refrigerator />} />

            </Routes>

            {/* ログイン画面以外で表示 */}
            {location.pathname !== "/login" &&
                location.pathname !== "/register" &&
                location.pathname !== "/" &&
                <BottomMenu />
            }

        </>
    );
}

function App() {

    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    );
}

export default App;