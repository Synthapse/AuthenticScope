import { Link, useNavigate } from "react-router-dom";
import { Button } from "shards-react"
import styled from "styled-components";
import { devices } from "./utils";
import { signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, googleProvider, readAllHistoryData } from "./auth/firebase";
import { FcGoogle } from "react-icons/fc";
import heroImage from "./images/authenticscopemain.jpg";
import aiCollect from "./images/aiData.jpg";
import { primaryColor } from "./ArticleList";

const MainContainer = styled.div`
    flex-direction: column;
    background-color: ${primaryColor};
    padding-left: 20px;
    position:absolute;
    min-height: 100vh;
    max-height: 100vh;
    min-width: 100vw;
    left: 0;
    
  @media ${devices.laptopL} {
    display: flex;
    flex-direction: row;
    position:absolute;
    height: 100vh;
    align-items: flex-start;
    min-height: 100%;
    min-width: 100vw;
    left: 0;
    margin: 0;
    padding: 0;
    padding-left: 80px;
  }
`

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    `


const Header = styled.h1`
    font-size:24px;
    color: #fff;
    margin-bottom: 20vh;

    @media ${devices.laptopL} {
        font-size: 24px;
        margin: 0 0 20% 0;
      }
`

export const ButtonContainer = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
    position: absolute;
    bottom: 1%;
    width: calc(100% - 40px);

    > button {
        width: 100%;
        height:60px;
    }

    @media ${devices.laptopL} {
        margin-top: 40px;
        margin-bottom: 40px;
        position: initial;
        > button {
            width: 240px;
        }
        }
`


const MainParagraph = styled.p`

    font-size: 24px;
    color: #fff;
    max-width: 100%;
    font-weight: 200;

    @media ${devices.laptopL} {
        width: 420px;
        font-size: 24px;
        color: #fff;
        max-width: 100%;
        font-weight: 200;
    }
    `

const TextContainer = styled.div`
margin-top: 4vh;
width: 100%;
@media ${devices.laptopL} {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 5vh;
  width: 60%;
}
`

const MainImage = styled.img`

display:none;

  @media ${devices.laptopL} {
    width: 40%;
    height: 100vh;
    object-fit: cover;
    display:flex;
  }
`


const Home = () => {


    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        try {
            const signInCredentials = await signInWithPopup(auth, googleProvider);
            if (signInCredentials) {
                navigate('/profile');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const navigateToProfile = () => {
        navigate('/profile');
    }

    useEffect(() => {
        if (auth?.currentUser?.email) {
            navigateToProfile();
        }
    }, [auth?.currentUser?.email])


    return (
        <HomeContainer>
            <MainContainer>
                <TextContainer>
                    <Header><b>Authentic Scope</b></Header>
                    <MainParagraph>Get concise <u>today</u> summaries about AI
                        Trustworthy, easy, seamlessly.</MainParagraph>
                    {!auth?.currentUser?.email ?
                        <ButtonContainer onClick={() => signInWithGoogle()} style={{ display: 'flex' }}>
                            <Button theme="dark"><FcGoogle size={"24px"} />Sign up</Button></ButtonContainer>
                        :
                        <ButtonContainer onClick={() => navigateToProfile()} style={{ display: 'flex' }}>
                            <Button theme="dark">Go to Profile</Button></ButtonContainer>
                    }
                </TextContainer>
                <MainImage src={heroImage} />
            </MainContainer>
            <Features />
            <Users />
            <AICollect />
            <Footer />
        </HomeContainer >
    )
}


const Accent = styled.span`
    background: linear-gradient(270deg, #FF3D3D 2.87%, #0029FF 96.74%);
    height:2px;
    width:120px;
    display:flex;
    margin: 0px 0 20px 0;
`

const FeaturesContainer = styled.div`

    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 110vh;
    align-items: center;

    h3{
        font-size: 18px;
        font-weight: 600;
        }

        p {
            font-size: 14px;
        }

    @media ${devices.laptopL} {
        display: flex;
        flex-direction: row;
        margin: 110vh 0 0px 0;
        align-items: center;
    }
    `

const Feature = styled.div`

width: 100%;
display: flex;
flex-direction: column;
align-items: center;
text-align: center;
margin: 0 0 40px 0;
    @media ${devices.laptopL} {
        width:30%;
        margin: 0 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align:center;

    }
`

const Features = () => {
    return (
        <FeaturesContainer>
            <Feature>
                <h3>Core Features</h3>
                <Accent />
                <p>Identify and prioritize essential features such as real-time news updates, categorized content and a user-friendly interface.</p>
            </Feature>
            <Feature>
                <h3> AI Integration & Personalization</h3>
                <Accent />

                <p>Implement advanced machine learning algorithms for content recommendation and user personalization. Focus on improving accuracy over time through continuous learning.</p>
            </Feature>
            <Feature>
                <h3> Future Innovations</h3>
                <Accent />
                <p>Keep an eye on emerging trends, technological advancements, and user preferences. Be ready to integrate new features and technologies to stay ahead in the rapidly evolving AI landscape.
                </p>
            </Feature>
        </FeaturesContainer>
    )
}

const UsersContainer = styled.div`

    display: flex
    flex-direction: column;

    @media ${devices.laptopL} {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin: 120px 0 120px 0;
    }
`

const User = styled.div`
    margin: 40px 0 40px 0;
    border: 2px solid transparent; /* Set the border to be transparent */
    border-image: linear-gradient(270deg, #FF3D3D 2.87%, #0029FF 96.74%);
    border-image-slice: 1; /* Ensure the entire border is covered by the gradient */
    padding: 20px;

    h4 {
        font-size: 14px;
        width: 15%;
        font-weight: 600;
    }

    @media ${devices.laptopL} {
        margin: 0 20px;
    }
`

const Users = () => {

    const [usersSummary, setUsersSummary] = useState<any[]>([]);

    useEffect(() => {
        readAllHistoryData().then((data) => {
            setUsersSummary(data.map((x: any) => x.data));

            const sortedData = Object.entries(data
                .reduce((result, item) => (result[item.data.userId] = [...(result[item.data.userId] || []), item.data], result), {}))
                .map(([userId, items]) => ({ userId, count: items.length }))
                .sort((a, b) => b.count - a.count);

            setUsersSummary(sortedData.slice(0, 4));
        });
    }, [])
    return (
        <UsersContainer>
            {usersSummary.map((x: any) => {
                return (
                    <User>
                        <h4>User: {x.userId}</h4>
                        <p>{x.count} summarizations</p>
                    </User>
                )
            })}
        </UsersContainer>
    )
}


const AiCollectContainer = styled.div`

    display: flex;
    flex-direction: column;

    @media ${devices.laptopL} {
        display: flex;
        width: 100%;
        flex-direction: row;
        
        img {
            width: 480px;
            height:480px;
        }
    }
`

const AiCollectText = styled.div`

    margin-top: 40px;

    h1 {
        font-size: 36px;
        font-weight: 600;
    }

    li {
        font-weight: 400;
    }

    @media ${devices.laptopL} {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 40px;
        width: 50%;
        margin-left: 20px;
        text-align:left;
    }
`


const AICollect = () => {

    return (
        <AiCollectContainer>
            <img src={aiCollect} />
            <AiCollectText>
                <h1>Why Collect AI Data?</h1>
                <p>
                    The heartbeat of Authentic Scope is in the data collected.
                    By gathering diverse and high-quality AI-related data, we empower
                    our platform to deliver accurate, insightful, and timely news content.
                </p>
                <p>
                    Your contributions play a crucial role in shaping the narrative
                    and ensuring a comprehensive view of the AI landscape.
                </p>

                <ul>
                    <li>Comprehensive AI News Coverage</li>
                    <li>Personalized User Experience</li>
                    <li>Verified and Trustworthy Sources</li>
                    <li>Community Engagement and Insights</li>
                </ul>
            </AiCollectText>
        </AiCollectContainer>
    )
}



const FooterContainer = styled.div`
    width: calc(100% + 40px);
    margin-left: -20px;
    align-items: center;
    justify-content: center;
    background-color: ${primaryColor};
    height:180px;
    display: flex;
    flex-direction: row;
    margin-top: 120px;

    @media ${devices.laptopL} {

    width: calc(100% + 160px);
    margin-left: -80px;


    }
`


const Footer = () => {

    return (
        <FooterContainer>
            <p>Synthapse © {new Date().getFullYear()}</p>
        </FooterContainer>
    )
}

export default Home;