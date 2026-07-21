import React, { useState } from "react";
import { Link } from "react-router-dom";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import HomeIcon from "@mui/icons-material/Home";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import KitchenIcon from "@mui/icons-material/Kitchen";

function BottomMenu() {

    const [value, setValue] = useState(0);

    return (
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
            sx={{
                position: "fixed",
                bottom: 0,
                width: "100%"
            }}
        >


            <BottomNavigationAction
                label="食事"
                icon={<RestaurantIcon />}
                component={Link}
                to="/meal"
            />
            <BottomNavigationAction
                label="買い物"
                icon={<ShoppingCartIcon />}
                component={Link}
                to="/shopping"
            />


            <BottomNavigationAction
                label="ホーム"
                icon={<HomeIcon />}
                component={Link}
                to="/home"
            />


            <BottomNavigationAction
                label="冷蔵庫"
                icon={<KitchenIcon />}
                component={Link}
                to="/refrigerator"
            />
            <BottomNavigationAction
                label="在庫"
                icon={<Inventory2Icon />}
                component={Link}
                to="/stock"
            />

        </BottomNavigation>
    );
}

export default BottomMenu;