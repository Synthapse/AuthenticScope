import { useNavigate } from "react-router-dom";
import { HoverDiv } from "../ArticleList"
import { IoIosReturnLeft } from "react-icons/io";

const ReturnIcon = () => {

    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <HoverDiv onClick={() => navigate(-1)} style={{ display: 'flex' }}> <IoIosReturnLeft style={{ fontSize: '24px ' }} /><p style={{ fontSize: '12px' }}>return </p></HoverDiv>
        </div>
    )
}

