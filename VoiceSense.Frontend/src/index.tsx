import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import ReactDOM from 'react-dom/client';
import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import Home from './Home';
import Demo, { primaryColor, tertiaryColor } from './Demo';
import Conversation from './Conversation';
import reportWebVitals from './reportWebVitals';
import SummarizationArticle from './SummarizationArticle';
import { StripeSuccess } from './payments/Success';
import { StripeCancel } from './payments/Cancel';
import styled from 'styled-components';
import { devices } from './utils';
import ReactGA from "react-ga4";
import config from "./config.json";
import Hotjar from '@hotjar/browser';
import { Auth } from "./auth/signIn";
import { Profile } from "./auth/profile";

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
  background-color: ${tertiaryColor};
  min-height: 100vh;
  height: 100%;
  width: 100%;
  max-width: 100%;
  padding-left: 20px;
  padding-right: 20px;

  @media ${devices.laptopL} {
    background-color: ${tertiaryColor};
    padding-left: 80px;
    padding-right: 80px;
  }
`


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);



ReactGA.initialize(config.apps.GoogleAnalitycs.measurement_id);
root.render(
  <React.StrictMode>
    <HashRouter>
      <GlobalContainer>
        <Routes>
          <Route path="/" element={<ColorContainer><Home /></ColorContainer>} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/article" element={<SummarizationArticle />} />
          <Route path="/conversation" element={<Conversation />} />
    
          Payments
          <Route path="/order-confirmation" element={<StripeSuccess />} />
          <Route path="/cancel" element={<StripeCancel />} />

          Auth
          <Route path ="/auth" element={<Auth/>}></Route>
          <Route path ="/profile" element={<Profile/>}></Route>
        </Routes>
      </GlobalContainer>
    </HashRouter>
  </React.StrictMode >
);

const SendAnalytics = () => {
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname,
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(SendAnalytics);
