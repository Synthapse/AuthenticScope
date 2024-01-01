import config from "./config.json";
import Hotjar from '@hotjar/browser';
import { Auth } from "./auth/signIn";
import { Profile } from "./auth/profile";
import { ImSun } from 'react-icons/im';
import HistoryArticles from "./auth/HistoryArticles";
import SummarizationArticle from './SummarizationArticle';
import { StripeSuccess } from './payments/Success';
import { StripeCancel } from './payments/Cancel';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { devices } from './utils';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Home from './Home';
import ArticleList, { primaryColor, tertiaryColor } from './ArticleList';
import Conversation from './Conversation';
import ReactDOM from 'react-dom/client';
import React, { useEffect, useState } from "react";
import ReactGA from "react-ga4";
const siteId = 3610032;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);


const ColorContainer = styled.div`

  padding-left: 20px;
  background-color: ${primaryColor};
  position:absolute;
  min-height: 100vh;
  max-height: 100vh;
  min-width: 100vw;
  left: 0;
  
  @media ${devices.laptopL} {
    position:absolute;
    min-height: 100%;
    min-width: 100vw;
    left: 0;
    margin: 0;
    padding: 0;
    padding-left: 80px;
  }
`

const GlobalContainer = styled.div`
  min-height: 100vh;
  height: 100%;
  width: 100%;
  max-width: 100%;
  padding-left: 20px;
  padding-right: 20px;

  @media ${devices.laptopL} {
    padding-left: 80px;
    padding-right: 80px;
  }
`

export const ThemeContext = React.createContext('light');


export const lightTheme = {
  body: '#FFF',
  text: '#363537',
  toggleBorder: '#FFF',
  background: '#363537',
}
export const darkTheme = {
  body: '#363537',
  text: '#FAFAFA',
  toggleBorder: '#6B8096',
  background: '#999',
}

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Helvetica, Arial, Roboto, sans-serif;
    transition: all 0.50s linear;
  }
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.text};
  }
  `

  ReactGA.initialize(config.apps.GoogleAnalitycs.measurement_id);

export const App = () => {
    const [theme, setTheme] = useState('light');
    const toggleTheme = () => {
      if (theme === 'light') {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };
  
    useEffect(() => {
      document.body.className = theme;
    }, [theme]);
    return (
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        <div style={{ position: 'absolute', right: 20 }}><ImSun style={{ fontSize: '24px' }} onClick={toggleTheme}>Toggle Theme</ImSun></div>
        <HashRouter>
          <GlobalContainer>
            <Routes>
              <Route path="/" element={<ColorContainer><Home /></ColorContainer>} />
              <Route path="/conversation" element={<Conversation />} />
  
              Payments
              <Route path="/order-confirmation" element={<StripeSuccess />} />
              <Route path="/cancel" element={<StripeCancel />} />
  
              Auth
              <Route path="/auth" element={<Auth />}></Route>
              <Route path="/articleList" element={<ArticleList />} />
              <Route path="/article" element={<SummarizationArticle />} />
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/history" element={<HistoryArticles />}></Route>
            </Routes>
          </GlobalContainer>
        </HashRouter>
      </ThemeProvider>
    )
  }