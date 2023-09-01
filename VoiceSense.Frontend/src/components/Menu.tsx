
import { useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { PiArticle } from 'react-icons/pi';
import { GoHistory } from 'react-icons/go';
import styled, { ThemeContext } from 'styled-components';
import { lightTheme } from '..';



const MenuContainer = styled.div`
    height: 100%;
    width: 60px;
    left: 0;
    top: 0;
    position: fixed;
    background-color: ${({ theme }) => theme === lightTheme ? '#f5f5f5' : '#30363d'};
    border-right: ${({ theme }) => theme === lightTheme ? '1px solid #30363d' : '1px solid white'};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
        width: 100%;
        height: 60px;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        bottom: 0;
        top: auto;
        position: fixed;
        border-right: none;
        border-top: 1px solid #30363d;
    }
`;

const MenuItem = styled.div`
    margin: 18px 0;

    &:hover {
        cursor: pointer;

        > svg {
            color: #007bff;
        }
    }
`;

const Menu = () => {

    const navigate = useNavigate();
    const navigateToPage = (url: string) => {
        navigate(url);
    };

    const iconSize = '24px';

    return (
        <ThemeContext.Consumer>
            {theme => (
                <MenuContainer>
                    <MenuItem onClick={() => navigateToPage("/articleList")}>
                        <p><PiArticle style={{ fontSize: iconSize }} /></p>
                    </MenuItem>
                    <MenuItem onClick={() => navigateToPage("/history")}>
                        <p><GoHistory style={{ fontSize: iconSize }} /></p>
                    </MenuItem>
                    <MenuItem onClick={() => navigateToPage("/profile")}>
                        <p><CgProfile style={{ fontSize: iconSize }} /></p>
                    </MenuItem>
                </MenuContainer>)}
        </ThemeContext.Consumer>
    )
}

export default Menu;