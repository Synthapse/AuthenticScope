import { signOut } from "firebase/auth";
import { IHistoryEvent, auth, readHistoryData } from "./firebase";
import { Button } from "shards-react";
import { HoverDiv } from "../Demo";
import { useNavigate } from 'react-router-dom';
import { IoIosReturnLeft } from "react-icons/io";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { Dna } from "react-loader-spinner";

export const Profile = () => {

    const navigate = useNavigate();

    const logOut = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    const [historyData, setHistoryData] = useState<IHistoryEvent[] | any>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchHistoryData = async () => {
            if (auth.currentUser) {
                try {
                    const data = await readHistoryData(auth.currentUser.uid);
                    setHistoryData(data.map((item: DocumentData) => item.data))
                    setLoading(false)
                } catch (error) {
                    console.log("Error fetching history data: ", error);
                }
            }
        };

        fetchHistoryData();
    }, [])


    return (
        <div style={{ paddingTop: '5%' }}>
            <HoverDiv onClick={() => navigate(-1)} style={{ display: 'flex' }}> <IoIosReturnLeft style={{ fontSize: '24px ' }} /><p style={{ fontSize: '12px' }}>return </p></HoverDiv>
            <img style={{ borderRadius: '50%', width: '72px', height: '72px' }} src={auth?.currentUser?.photoURL ?? ""} />
            <h3>{auth?.currentUser?.displayName}</h3>
            <p>{auth?.currentUser?.email}</p>
            <Button theme="dark" onClick={logOut}>Log out</Button>
            <hr />
            <h4>History:</h4>
            {!loading ?
                historyData.map((item: IHistoryEvent, index: number) => {
                    console.log(item.date)
                    return (
                        <div key={index}>
                            <h5>{item.title}</h5>
                            <p>{item.date && item.date.toDate().toString()}</p>
                            <p>{item.content}</p>
                        </div>
                    )
                }) : <Dna
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                />}
        </div>
    );
};