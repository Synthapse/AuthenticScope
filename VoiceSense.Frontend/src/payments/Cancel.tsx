import React from 'react'
import { useLottie } from "lottie-react";
import Cancel from '../lottie/cancel.json'
import { GrFormNextLink } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import { HoverDiv, primaryColor } from '../Demo';


export const StripeCancel = () => {
    const options = {
        animationData: Cancel,
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

        <p>Payment cancelled!</p>
        <HoverDiv>
            <div style={{ marginRight: '40px' }} onClick={() => navigateToArticles()}>
                <p style={{ color: primaryColor }}>
                    <GrFormNextLink style={{ marginRight: '10px' }} />
                    Go to articles
                </p>
            </div>
        </HoverDiv>
    </div >;
}