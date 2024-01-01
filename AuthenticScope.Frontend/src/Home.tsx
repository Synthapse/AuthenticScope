import { Link, useNavigate } from "react-router-dom";
import { Button } from "shards-react"
import styled from "styled-components";
import { devices } from "./utils";
import { signInWithPopup } from "firebase/auth";
import { useEffect } from "react";
import { auth, googleProvider } from "./auth/firebase";
import { FcGoogle } from "react-icons/fc";
import heroImage from "./images/authenticscopemain.jpg";

const MainContainer = styled.div`
    flex-direction: column;

  @media ${devices.laptopL} {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

  }
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
        <MainContainer>
            <TextContainer>
                <Header><b>Authentic Scope</b></Header>
                <MainParagraph>Get concise <u>today</u> summaries about AI
                    Trustworthy, easy, seamlessly.</MainParagraph>
                {!auth?.currentUser?.email &&
                    <ButtonContainer onClick={() => signInWithGoogle()} style={{ display: 'flex' }}>
                        <Button theme="dark"><FcGoogle size={"24px"} />Sign up</Button></ButtonContainer>
                }
            </TextContainer>
            <MainImage src={heroImage} />
        </MainContainer>

    )
}

export default Home;