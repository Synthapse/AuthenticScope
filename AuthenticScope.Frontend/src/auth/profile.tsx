import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { Button } from "shards-react";
import { useNavigate } from 'react-router-dom';

import Menu from "../components/Menu";
import { useContext, useEffect, useState } from "react";
import { ImSun } from "react-icons/im";
import { ThemeContext } from "styled-components";

interface IProfile  {
    toggleTheme: () => void;
}

export const Profile = ({toggleTheme} : IProfile) => {

    const navigate = useNavigate();

    const logOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ paddingTop: '5%' }}>
            <Menu />
            <img style={{ borderRadius: '50%', width: '72px', height: '72px' }} src={auth?.currentUser?.photoURL ?? ""} />
            <h3>{auth?.currentUser?.displayName}</h3>
            <p>{auth?.currentUser?.email}</p>
            <Button theme="dark" onClick={logOut}>Log out</Button>
            <hr />
            <div><ImSun style={{ fontSize: '24px' }} onClick={toggleTheme}>Toggle Theme</ImSun></div>

        </div>
    );
};