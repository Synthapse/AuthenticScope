import { Link } from "react-router-dom";
import { Button } from "shards-react"
import { TypeAnimation } from 'react-type-animation';
import styled from "styled-components";
import { devices } from "./utils";


const Header = styled.h1`

    font-size:38px;
    max-width:50%;
    @media ${devices.laptopL} {
        font-size: 48px;
      }
`

const ButtonContainer = styled.div`
    margin-top: 20px;
    margin-bottom: 20px;
    position: absolute;
    bottom: 20%;
    width: 100%;

    > button {
        width: calc(100% - 40px)
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
    font-size: 16px;
    max-width: 100%;
    @media ${devices.laptopL} {
        font-size: 14px;
        max-width: 50%;
        }
`

const Home = () => {

    return (
        <div style={{ paddingTop: '20%' }}>
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
        </div>
    )
}

export default Home;