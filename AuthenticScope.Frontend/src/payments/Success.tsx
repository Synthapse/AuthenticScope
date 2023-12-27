import React from 'react'
import { useLottie } from "lottie-react";
import Success from '../lottie/success.json'
import { HoverDiv, primaryColor } from '../ArticleList';
import { GrFormNextLink } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';

export const StripeSuccess = () => {
    const options = {
        animationData: Success,
        loop: false
    };

    const { View } = useLottie(options);

    const navigate = useNavigate();
    const navigateToArticles = () => {
        navigate('/demo');
    }


    return <div style={{ justifyContent: 'left', justifyItems: 'center', display: 'grid' }}>
        <div style={{ height: '172px' }}>
            {View}
        </div>

        <p>Payment successes!</p>
        <HoverDiv>
            <div style={{ marginRight: '40px' }} onClick={() => navigateToArticles()}>
                <p style={{ color: primaryColor }}>
                    <GrFormNextLink style={{ marginRight: '10px' }} />
                    Go to articles
                </p>
            </div>
        </HoverDiv>
    </div >
}