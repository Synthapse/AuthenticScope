import { Link } from "react-router-dom";
import { Button } from "shards-react"
import { TypeAnimation } from 'react-type-animation';
import styled from "styled-components";
import { devices } from "./utils";


const HomeContainer = styled.div`
    padding-top: 20px;
    @media ${devices.laptopL} {
        padding-top: 20%;
      }
    `

const Header = styled.h1`
    font-size:42px;
    max-width:50%;
    @media ${devices.laptopL} {
        font-size: 48px;
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


const Paragraph = styled.p`
    font-size: 24px;
    max-width: 100%;
    bottom: 20%;
    margin-top: 60%;
    @media ${devices.laptopL} {
        margin-top: 0%;
        font-size: 18px;
        max-width: 50%;
        }
`

const Home = () => {

    return (
        <HomeContainer>
            <Header><b>VoiceSense</b>     <TypeAnimation
                sequence={[
                    // Same substring at the start will only be typed out once, initially
                    'Summarization',
                    2000, // wait 1s before replacing "Summarization" with "Conversation"
                    'Conversation',
                    2000
                ]}
                wrapper="span"
                style={{ color: 'white' }}
                speed={50}
                repeat={Infinity}
            /></Header>
            <Paragraph>Turn articles into audio with cutting-edge NLP. Get concise summaries for listening on the go, presentations, and accessibility. Streamline content into engaging audio formats effortlessly.</Paragraph>
            <Link to="/demo">
                <ButtonContainer>
                    <Button theme="dark">
                        Try summarization
                    </Button>
                </ButtonContainer>
            </Link>
            {/* <Link to="/conversation">
                <Button style={{ marginLeft: '10px' }} outline theme="dark">
                    Try conversations
                </Button>
            </Link> */}
        </HomeContainer>
    )
}

export default Home;