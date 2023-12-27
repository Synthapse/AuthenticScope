import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BiCustomize, } from "react-icons/bi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiMusic, FiPauseCircle, FiPlayCircle } from "react-icons/fi";
import { BsSoundwave } from "react-icons/bs";
import { PiQueueFill } from "react-icons/pi";
import config from "./config.json";
import { HoverDiv, IVoice, LinkText, Select } from './ArticleList';
import axios from 'axios';
import { Dna } from 'react-loader-spinner';
import { Button } from 'shards-react';
import { IoIosReturnLeft } from 'react-icons/io';
import styled from 'styled-components';
import { devices } from './utils';
import Stripe from './payments/Stripe';
import Limit from './lottie/limit.json'
import { useLottie } from 'lottie-react';
import { auth, readComments, saveComment, writeHistoryData } from './auth/firebase';

const ArticleContainer = styled.div`
    display: column;
`

const Header = styled.h2`
    font-weight: bold;
    letter-spacing: 1.5;
    line-height: 1.35;
    width: 60%;
    margin-bottom: 40px;
`

const ArticleText = styled.div`
    height: 100%;
    width: 100%;
    border-radius: 28px;
    padding-top:20px;
    font-size: 18px;
    margin-right: 20px;

    @media ${devices.laptopL} {
        width: 60%;
        font-size:14px;
      }

`

const SummarizationArticle = () => {

    const location = useLocation();

    const [summarizationText, setSummarizationText] = useState<string | null>(null)

    const [accent, setAccent] = useState('american');
    const [useCase, setUseCase] = useState('narration');

    const [ages, setAges] = useState<string[]>([]);
    const [genders, setGenders] = useState<string[]>([]);
    const [descriptions, setDescriptions] = useState<string[]>([]);
    const [accents, setAccents] = useState<string[]>([]);
    const [useCases, setUseCases] = useState<string[]>([]);

    const [age, setAge] = useState('young');
    const [gender, setGender] = useState('male');
    const [description, setDescription] = useState('calm')

    const [audioUrl, setAudioUrl] = useState<HTMLAudioElement | null>(null);
    const [customize, setCustomize] = useState(false);
    const [audioLoading, setAudioLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [voices, setVoices] = useState<IVoice[]>([]);
    const [loading, setLoading] = useState(false);


    const summarizeText = async (articleUrl: string) => {
        setLoading(true)
        try {

            const options = {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: 'Bearer An98AF6Sk9rG0TTzs1TKCV7FuKtDhzkb'
                },
                body: JSON.stringify({ sourceType: 'URL', source: articleUrl })
            };

            fetch('https://api.ai21.com/studio/v1/summarize', options)
                .then(response => response.json())
                .then(response => {
                    setSummarizationText(response?.summary)
                    if (auth.currentUser) {
                        saveDataToUserHistory(response?.summary);
                    }
                }).catch(err => console.error(err));


            setLoading(false)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const getVoices = async () => {
        try {
            const response = await axios.get(`${config.apps.VoiceSenseAPI.url}/voices`);
            const voices: IVoice[] = response?.data;
            setVoices(voices);
            setDescriptions(Array.from(new Set(voices.map(obj => obj.description))))
            setUseCases(Array.from(new Set(voices.map(obj => obj.use_case))))
            setGenders(Array.from(new Set(voices.map(obj => obj.gender))))
            setAges(Array.from(new Set(voices.map(obj => obj.age))))
            setAccents(Array.from(new Set(voices.map(obj => obj.accent))))

        } catch (error) {
            console.error('Error:', error);
        }
    }

    const setGenderWithLimitation = (e: any) => {

        const voicesDescriptionWithThisGender = voices.filter(x => x.gender === e.target.value && x.age).map(x => x.description)
        const voicesAgeWithThisGender = voices.filter(x => x.gender === e.target.value).map(x => x.age)

        setDescriptions(Array.from(new Set(voicesDescriptionWithThisGender)))
        setAges(Array.from(new Set(voicesAgeWithThisGender)))
        setGender(e.target.value)
    }

    const setAgesWithLimitation = (e: any) => {

        const voicesDescriptionWithThisAgeAndGender = voices.filter(x => x.age === e.target.value && x.gender == gender).map(x => x.description)
        setDescriptions(Array.from(new Set(voicesDescriptionWithThisAgeAndGender)))
        setAge(e.target.value)
    }

    const setDescriptionWithLimitation = (e: any) => {
        setDescription(e.target.value)
    }

    const [ipAddress, setIPAddress] = useState<string>();
    const [limitSoftware, setLimitSoftware] = useState<boolean>(false);
    const [visitCounts, setVisitCounts] = useState({});

    const storeUserVisit = () => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const currentIP = data.ip;
                setIPAddress(currentIP);
                //@ts-ignore
                const storedVisitCounts = JSON.parse(localStorage.getItem('visitCounts')) || {};

                if (storedVisitCounts[currentIP] >= 2000) {
                    setLimitSoftware(true);
                }

                storedVisitCounts[currentIP] += 1;
                localStorage.setItem('visitCounts', JSON.stringify(storedVisitCounts));
                setVisitCounts(storedVisitCounts);
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        //getVoices();
        setLoading(true);
        summarizeText(location.state.article.AIArticleLink);
        //storeUserVisit();
    }, [])


    const playAudio = () => {
        audioUrl?.play();
        setIsPlaying(true)
    };

    const pauseAudio = () => {
        audioUrl?.pause();
        setIsPlaying(false)
    }

    const sendVoiceGeneratorRequest = async (summarizationText: string) => {

        setAudioLoading(true);

        try {
            const response = await axios.get(`${config.apps.VoiceSenseAPI.url}/audioGenerate`, {
                params: {
                    summarization_text: summarizationText,
                    age: age,
                    description: description,
                    gender: gender,
                    // accent: accent,
                    // useCase: useCase,
                },
                responseType: 'blob',
            });
            const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(new Audio(audioUrl));
            setAudioLoading(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const saveDataToUserHistory = (summarizationText: string) => {
        writeHistoryData({
            userId: auth.currentUser?.uid ?? "",
            title: location.state.article.AIArticleTitle,
            content: summarizationText,
            date: new Date()
        })
    }



    const isURL = (str: string) => {
        const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlPattern.test(str);
    }

    const navigate = useNavigate();
    const articleTitle = location.state.article.AIArticleTitle;

    return (
        <div style={{ paddingTop: '5%' }}>
            <HoverDiv onClick={() => navigate(-1)} style={{ display: 'flex' }}> <IoIosReturnLeft style={{ fontSize: '24px ' }} /><p style={{ fontSize: '12px' }}>return </p></HoverDiv>
            {limitSoftware ? <ProductLimitation />
                :
                <>
                    <Header>{articleTitle}</Header>
                    {location.state.article.AIArticleDate}
                    {summarizationText ?
                        <>
                            <ArticleContainer>
                                <ArticleText>
                                    <p>{summarizationText}</p>
                                </ArticleText>
                                {audioLoading ? <Dna
                                    visible={true}
                                    height="80"
                                    width="80"
                                    ariaLabel="dna-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="dna-wrapper"
                                /> :
                                    <>
                                        {audioUrl ? <div>
                                            {isPlaying ?
                                                <Button onClick={pauseAudio} outline theme={"warning"}>
                                                    <FiPauseCircle /> Pause
                                                </Button> :
                                                <Button onClick={playAudio} outline theme={"warning"}>
                                                    <FiPlayCircle /> Play
                                                </Button>
                                            }
                                            <div style={{ display: 'flex' }}>
                                                <LinkText onClick={() => setAudioUrl(null)}><p style={{ margin: 0, marginRight: '10px', fontSize: '12px' }}><BsSoundwave />Generate another</p></LinkText>
                                            </div>
                                        </div> :
                                            <div>Audio Generation only for Premium Users Tiers.</div>
                                            // <div>
                                            //     <Button onClick={() => sendVoiceGeneratorRequest(summarizationText)} outline theme="dark">
                                            //         <FiMusic /> Generate audio
                                            //     </Button>
                                            //     <LinkText onClick={() => setCustomize(!customize)}> <BiCustomize /> <p>Customize</p></LinkText>
                                            //     {customize &&
                                            //         <div style={{ width: '24%', fontSize: '12px' }}>
                                            //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            //                 <p>Gender:</p>
                                            //                 <Select options={genders} setState={setGenderWithLimitation} />
                                            //             </div>
                                            //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            //                 <p>Age:</p>
                                            //                 <Select options={ages} setState={setAgesWithLimitation} />
                                            //             </div>

                                            //             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            //                 <p>Description:</p>
                                            //                 <Select options={descriptions} setState={setDescriptionWithLimitation} />
                                            //             </div>
                                            //         </div>
                                            //     }
                                            // </div>
                                        }
                                    </>
                                }
                            </ArticleContainer>
                        </> : <div>
                            <Dna
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="dna-loading"
                                wrapperStyle={{}}
                                wrapperClass="dna-wrapper"
                            />
                        </div>
                    }

                    <Comments user={auth.currentUser} title={articleTitle} />

                </>}
        </div >
    )
}


const StyledInput = styled.input`
    border-radius: 28px;
    height: 40px;
    width: 40%;
    border: 1px solid #ccc;
    padding: 10px;
    margin-right: 10px;
    `


interface IComments {
    user: any;
    title: string;
}


const ArticleComment = styled.div`
    border-radius: 28px;
    padding: 20px 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;

    > p:nth-child(2) {
        font-size:12px;
        margin:0;
        padding:0;
    }
    `

const Comments = ({ user, title }: IComments) => {

    const [comment, setComment] = useState<string>('');
    const [comments, setComments] = useState<string[]>([]);


    const addComment = () => {
        saveComment(user ?? '', title, comment).then(() => {
            readArticleComments()
        })
    }

    const readArticleComments = async () => {


        await readComments(title).then((data) => {
            setComments(data.map((x: any) => x))
            console.log(data);
        })

    }

    useEffect(() => {
        readArticleComments()
    }, [])


    return (
        <>
            <hr />
            <StyledInput
                onChange={(e) => setComment(e.target.value)}
                placeholder={"Whats your thoughts? Let's debate!"}
            />
            <Button theme="dark" onClick={() => addComment()}>Discuss</Button>
            <br /><br />
            {comments.map((x: any, index) => {
                return (
                    <ArticleComment key={index}>
                        <p>{x.comment}</p>
                        <p>{x.user.userId} • {x.date.toDate().toString()}</p>
                    </ArticleComment>
                )
            })}
        </>
    )
}



const ProductLimitation = () => {

    const options = {
        animationData: Limit,
        loop: false,
    };

    const { View } = useLottie(options);


    return (
        <div>
            <div style={{ height: '120px', width: '120px' }}>
                {View}
            </div>

            <p>You've devoured our array of FREE articles for today.<br /> But hold on, there's a door to even greater discovery. 🚪</p>
            <p>Elevate your experience with Premium Access at just $2!<br /> Unlock handpicked premium content and fuel your intellect today. 🔑🚀</p>

            <Stripe />
        </div>
    )
}


export default SummarizationArticle;