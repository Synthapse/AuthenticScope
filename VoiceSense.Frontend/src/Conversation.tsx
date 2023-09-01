import axios from "axios";
import { useEffect, useState } from "react";
import config from "./config.json";
import { HoverDiv, IVoice, Select } from "./ArticleList";
import UploadFiles from "./UploadFile";
import { IoIosReturnLeft } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

const Conversation = () => {

    const navigate = useNavigate();
    const [voices, setVoices] = useState<IVoice[]>([]);
    const [firstPersonVoice, setFirstPersonVoice] = useState<string>('');
    const [secondPersonVoice, setSecondPersonVoice] = useState<string>('');

    const getVoices = async () => {
        try {
            const response = await axios.get(`${config.apps.VoiceSenseAPI.url}/voices`);
            const voices: IVoice[] = response?.data;
            setVoices(voices);
            setFirstPersonVoice(voices[0]?.voice_id);
            setSecondPersonVoice(voices[0]?.voice_id);

        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        getVoices();
    }, [])


    const setFirstPersonAttributes = (event: any) => {
        setFirstPersonVoice(voices.find(x => x.names.includes(event.target.value))?.voice_id || '');
    }

    const setSecondPersonAttributes = (event: any) => {
        setSecondPersonVoice(voices.find(x => x.names.includes(event.target.value))?.voice_id || '');
    }

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ height: '50vh', width: '40%', fontSize: '16px', marginTop: '40px', marginRight: '20px' }}>
                <HoverDiv onClick={() => navigate(-1)} style={{ display: 'flex' }}> <IoIosReturnLeft style={{ fontSize: '24px ' }} /><p style={{ fontSize: '12px' }}>return </p></HoverDiv>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <p>Select voice for first person:</p>
                    <Select options={voices.map(x => x.names)} setState={setFirstPersonAttributes} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <p>Select voice for second person:</p>
                    <Select options={voices.map(x => x.names)} setState={setSecondPersonAttributes} />
                </div>
                <p><b>Please upload your whatsapp conversation:</b></p>
                <ul style={{ fontSize: '12px' }}>
                    <li>Open the individual or group chat.</li>
                    <li>Tap - More - Export chat.</li>
                    <li>Choose whether to export with media or without media.</li></ul>
                <UploadFiles firstVoiceId={firstPersonVoice} secondVoiceId={secondPersonVoice} />
            </div>
        </div>
    )
}

export default Conversation;