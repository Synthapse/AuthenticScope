

import axios from "axios";
import { useState, useEffect } from "react";
import config from "./config.json";
import { Button } from "shards-react";
import { Dna } from 'react-loader-spinner'
import { FiPauseCircle, FiPlayCircle } from "react-icons/fi";

const uploadData = async (file: string | Blob, firstPersonVoiceId: string, secondPersonVoiceId: string, onUploadProgress: any) => {
    let formData = new FormData();

    formData.append("file", file);
    formData.append("firstPersonVoiceId", firstPersonVoiceId);
    formData.append("secondPersonVoiceId", secondPersonVoiceId);

    return await axios.post(`${config.apps.VoiceSenseAPI.url}/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });
};

const getFiles = async () => {
    return await axios.get(`${config.apps.VoiceSenseAPI.url}/files`, {
        responseType: "blob",
    });
};

interface IUploadFiles {
    firstVoiceId: string;
    secondVoiceId: string;
}

const UploadFiles = ({ firstVoiceId, secondVoiceId }: IUploadFiles) => {
    const [selectedFiles, setSelectedFiles] = useState<any>(undefined);
    const [currentFile, setCurrentFile] = useState<any>(undefined);
    const [progress, setProgress] = useState<number>(0);
    const [message, setMessage] = useState<any>("");
    const [fileInfos, setFileInfos] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // getFiles().then((response) => {
        //     const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
        //     const audioUrl = URL.createObjectURL(audioBlob);
        //     setAudioUrl(new Audio(audioUrl));
        //     setFileInfos([response.data]);
        // });
    }, []);

    const selectFile = (event: { target: { files: any; }; }) => {
        setSelectedFiles(event.target.files);
    };

    const upload = () => {
        let currentFile = selectedFiles[0];

        setLoading(true)
        setProgress(0);
        setCurrentFile(currentFile);

        uploadData(currentFile, firstVoiceId, secondVoiceId, (event: { loaded: number; total: number; }) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        })
            .then((response) => {
                setMessage(response.data.message);
                return getFiles();
            })
            .then((files) => {
                setLoading(false)
                setFileInfos([files.data]);
            })
            .catch((e) => {
                setLoading(false)
                setProgress(0);
                setMessage(e.message + " " + e.response.data.error);
                setCurrentFile(undefined);
            });

        setSelectedFiles(undefined);
    };

    const playAudio = () => {
        audioUrl?.play();
        setIsPlaying(true)
    };

    const pauseAudio = () => {
        audioUrl?.pause();
        setIsPlaying(false)
    }

    return (
        <div>
            {currentFile && (
                <div className="progress">
                    <div
                        role="progressbar"
                        aria-valuenow={progress}
                        style={{ width: progress + "%" }}
                    >
                        {progress}%
                    </div>
                </div>
            )}
            {
                loading
                    ?
                    <Dna
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="dna-loading"
                        wrapperStyle={{}}
                        wrapperClass="dna-wrapper"
                    />
                    :
                    <>            <label className="btn btn-default">
                        <input type="file" onChange={selectFile} />
                    </label>
                        <div>
                            <Button
                                theme="dark"
                                disabled={!selectedFiles}
                                onClick={upload}
                            >
                                Upload
                            </Button>
                        </div>
                        <div style={{ color: '#ffb400' }}>
                            {message}
                        </div>

                        {fileInfos.length > 0 &&
                            <div style={{ marginTop: '20px' }} className="card">
                                <div className="card-header">List of files:</div>
                                <ul className="list-group list-group-flush">
                                    {fileInfos.map((file: any, index: any) => (
                                        <li className="list-group-item" key={index}>
                                            {isPlaying ?
                                                <Button onClick={pauseAudio} outline theme={"warning"}>
                                                    <FiPauseCircle /> Pause
                                                </Button> :
                                                <Button onClick={playAudio} outline theme={"warning"}>
                                                    <FiPlayCircle /> Play
                                                </Button>
                                            }
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        }
                    </>




            }
        </div >
    );
};

export default UploadFiles;