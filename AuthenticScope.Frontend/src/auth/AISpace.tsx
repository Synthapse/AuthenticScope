import { IHistoryEvent, auth, getPublicAIProfiles, readHistoryData } from "./firebase";
import { useEffect, useState } from "react";
import { DocumentData, Timestamp } from "firebase/firestore";
import { Dna } from "react-loader-spinner";
import Menu from "../components/Menu";
import styled from "styled-components";
import Accordion from "../components/Accordion";
import { useNavigate, useParams } from "react-router-dom";
import { CarouselContainer } from "../components/Carousell";
import { HoverDiv, LinkText, primaryColor } from "../ArticleList";
import { IoIosReturnLeft } from "react-icons/io";
import { GrFormNextLink } from "react-icons/gr";

const AISpace = () => {

    const navigate = useNavigate();
    const [historyData, setHistoryData] = useState<IHistoryEvent[] | any>([]);
    const [publicAIProfiles, setPublicAIProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const { userId } = useParams();


    useEffect(() => {
        const fetchpublicAISpace = async () => {
            const publicAIProfiles = await getPublicAIProfiles();
            if (publicAIProfiles && publicAIProfiles.length > 0) {
                setPublicAIProfiles(publicAIProfiles)
            }
        };


        const fetchHistoryData = async () => {
            if (userId) {
                try {
                    const data = await readHistoryData(userId);
                    setHistoryData(data.map((item: DocumentData) => item.data))
                    setLoading(false)
                } catch (error) {
                    console.log("Error fetching history data: ", error);
                }
            }
        };

        fetchpublicAISpace();
        fetchHistoryData();
    }, [])

    const uniqueHistoryData = historyData.reduce((accumulator: any[], current: { title: string; }) => {
        if (!accumulator.find((item) => item.title === current.title)) {
            accumulator.push(current);
        }
        return accumulator;
    }, []);

    const navigateWithRefresh = () => {
        navigate(`/aiSpace/${auth.currentUser?.uid}`)
        window.location.reload();
    }

    const filteredPublicProfiles = publicAIProfiles.filter(userProfile => userProfile.user.userId !== auth?.currentUser?.uid)

    return (
        <div style={{ paddingTop: '5%' }}>
            <Menu />
            {userId !== auth.currentUser?.uid
                ?
                <>
                    <HoverDiv onClick={() => navigateWithRefresh()} style={{ display: 'flex' }}> <IoIosReturnLeft style={{ fontSize: '24px ' }} /><p style={{ fontSize: '12px' }}>return to your space </p></HoverDiv>
                    <hr />
                </>
                :
                <>
                    {filteredPublicProfiles.length > 0 && <PublicAISpaces publicAIProfiles={filteredPublicProfiles} />}
                    <hr />
                </>
            }
            <b>{uniqueHistoryData.length} articles</b> saves in your private AI space.

            {
                !loading ?
                    uniqueHistoryData.sort((a: { date: number; }, b: { date: number; }) => b.date - a.date).map((item: IHistoryEvent, index: number) => {
                        return (
                            <div key={index}>
                                <Accordion title={item.title} content={item.content} date={item.date && item.date.toDate().toString()} />
                            </div>
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

const PublicAIProfile = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    `

const PublicAISpaces = ({ publicAIProfiles }: { publicAIProfiles: any[] }) => {

    const navigate = useNavigate();

    const navigateToUserAISpace = (url: string) => {
        navigate(url)
        window.location.reload();
    }

    return (
        <>
            <p>Public AI spaces:</p>
            <CarouselContainer slidesPresented={1}>

                {
                    publicAIProfiles.map((item, index) => {
                        return (
                            <PublicAIProfile key={index}>
                                <img style={{ borderRadius: '50%', width: '32px', height: '32px' }} src={item.user.photoUrl} />
                                <p>{item.user.userName ?? item.user.userEmail}</p>
                                <HoverDiv>
                                    <div style={{ display: 'flex', color: primaryColor }}>
                                        <p onClick={() => navigateToUserAISpace(`/aiSpace/${item.user.userId}`)} >
                                            <GrFormNextLink style={{ marginRight: '10px' }} />
                                            View user space
                                        </p>
                                    </div>
                                </HoverDiv>
                            </PublicAIProfile>
                        )
                    })
                }
            </CarouselContainer >
        </>
    )
}


export default AISpace;