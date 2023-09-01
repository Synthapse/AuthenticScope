import { IHistoryEvent, auth, readHistoryData } from "./firebase";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { Dna } from "react-loader-spinner";
import Menu from "../components/Menu";
import styled from "styled-components";

const HistoryItem = styled.div`
    border-bottom-width: 1;
    border-top-width: 0;
    border-left-width: 0;
    border-right-width: 0;
    border-color: #808080;
    border-style: solid;
    margin-bottom: 20px;
    margin-top: 20px;
    `

const HistoryArticles = () => {

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
            <Menu />
            <h2>History:</h2>
            {
                !loading ?
                    historyData.map((item: IHistoryEvent, index: number) => {
                        return (
                            <HistoryItem key={index}>
                                <h4>{item.title}</h4>
                                <p>{item.date && item.date.toDate().toString()}</p>
                                <p>{item.content}</p>
                            </HistoryItem>
                        )
                    }) : <Dna
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="dna-loading"
                        wrapperStyle={{}}
                        wrapperClass="dna-wrapper"
                    />
            }
        </div>
    )
}

export default HistoryArticles;