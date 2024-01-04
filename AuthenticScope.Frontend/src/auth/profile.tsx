import { signOut } from "firebase/auth";
import { auth, getUserProfile, saveUserProfile } from "./firebase";
import { Button } from "shards-react";
import { useNavigate } from 'react-router-dom';
import Menu from "../components/Menu";
import { useEffect, useState } from "react";
import Switch from "react-switch";
import styled from 'styled-components';


const SwitchElement = styled.div`
    display:flex;
`

interface IProfile {
    toggleTheme: () => void;
    theme: string;
}

export const Profile = ({ toggleTheme, theme }: IProfile) => {

    const navigate = useNavigate();


    const [userProfile, setUserProfile] = useState<any>([]); // [IUserProfile
    const [publicAISpace, setPublicAISpace] = useState(false);
    const [darkTheme, setDarkTheme] = useState(theme);

    const logOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (checked: boolean) => {
        setPublicAISpace(checked);
    }

    const saveUserProfileSettings = () => {
        saveUserProfile(auth?.currentUser, publicAISpace)
        fetchUserProfile()
    }

    const fetchUserProfile = async () => {
        try {
            const userProfile = await getUserProfile(auth?.currentUser?.uid ?? "");
            setUserProfile(userProfile);
        } catch (error) {
            console.log("Error fetching history data: ", error);
        }
    };

    useEffect(() => {

        fetchUserProfile();
    }, [])


    console.log(userProfile);


    return (
        <div style={{ paddingTop: '5%' }}>
            <Menu />
            <img style={{ borderRadius: '50%', width: '72px', height: '72px' }} src={auth?.currentUser?.photoURL ?? ""} />
            <h3>{auth?.currentUser?.displayName}</h3>
            <p>{auth?.currentUser?.email}</p>
            <Button theme="dark" onClick={logOut}>Log out</Button>
            <hr />
            <SwitchElement><Switch checked={theme !== 'light'} onChange={toggleTheme} checkedIcon={false} uncheckedIcon={false} />Dark theme</SwitchElement>

            <hr />
            {userProfile.length > 0 && <>
                Your AI space is {userProfile[0].publicAISpace ? "public" : "private"}

                <hr />

                <SwitchElement>
                    <Switch checked={publicAISpace} onChange={handleChange} checkedIcon={false} uncheckedIcon={false} /> Make your AI space public
                    <br />
                </SwitchElement>
            </>
            }
            <hr />
            <Button theme="dark" onClick={saveUserProfileSettings}>Save</Button>
        </div>
    );
};