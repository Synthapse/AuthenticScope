import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./auth/firebase";
import { FcGoogle } from "react-icons/fc";
import { HoverDiv } from "./ArticleList";
import styled from "styled-components";
import { Button } from "shards-react";
import { ButtonContainer } from "./Home";
import { devices } from "./utils";
import { useEffect } from "react";


const List = styled.ul`
    padding-top: 20%;

    font-size: 18px;
    @media ${devices.laptopL} {
        font-size: 18px;
        padding-left: 0%;
    }

    > li {
        margin-bottom: 20px;
    }
`

const Demo = () => {

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
        <div>
            <List>
                <li><b>Efficient News Updates:</b> Stay up-to-date with the latest news through AI-powered summarization, saving you time.</li>
                <li><b>Customized Content:</b> Tailor your news feed to your interests, receiving summaries on topics that matter most to you.</li>
                <li><b>Personalized Recommendations:</b> Benefit from AI algorithms that learn your preferences and provide relevant news suggestions.</li>
                <li><b>Seamless User Experience:</b> Enjoy a seamless and user-friendly platform for accessing concise and informative news summaries.</li>
            </List>
            {!auth?.currentUser?.email &&
                <ButtonContainer onClick={() => signInWithGoogle()} style={{ display: 'flex' }}>
                    <Button theme="dark"><FcGoogle size={"24px"} />Sign up</Button></ButtonContainer>
            }
        </div>
    )
}

export default Demo;