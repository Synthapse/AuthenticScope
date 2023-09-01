import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./auth/firebase";
import { FcGoogle } from "react-icons/fc";
import { HoverDiv } from "./ArticleList";

const Demo = () => {

    const navigate = useNavigate();
    
    const signInWithGoogle = async () => {
        try {
            const test = await signInWithPopup(auth, googleProvider);
            console.log(test);
        } catch (err) {
            console.error(err);
        }
    };

    const navigateToProfile = () => {
        navigate('/profile');
    }


    return (
        <div>
            <h1>demo</h1>
            {!auth?.currentUser?.email ?
                <div onClick={() => signInWithGoogle()} style={{ display: 'flex' }}><FcGoogle /> <p>Sign up</p></div>
                : <HoverDiv onClick={() => navigateToProfile()}> {auth?.currentUser?.photoURL ? <img style={{ borderRadius: '50%', width: '24px', height: '24px' }} src={auth?.currentUser?.photoURL ?? ""} /> : <p>{auth?.currentUser?.email}</p>}</HoverDiv>
            }
        </div>
    )
}

export default Demo;