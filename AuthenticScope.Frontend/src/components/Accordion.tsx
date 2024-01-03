import React, { useState } from 'react';
import styled from 'styled-components';

interface IAccordion {
    title: string;
    date?: string
    content?: string | null;
}


const AccordionItem = styled.div`
    border-bottom-width: 0;
    border-top-width: 1;
    border-left-width: 0;
    border-right-width: 0;
    border-color: #808080;
    border-style: solid;
    padding-bottom: 10px;
    padding-top: 10px;


    `

const AccordionTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    line-height: 1.45;
    cursor: pointer;
    `

const AccordionContent = styled.div`
    padding: 10px 0;
`

const Accordion = ({ title, date, content }: IAccordion) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <AccordionItem>
            <AccordionTitle onClick={() => setIsActive(!isActive)}>
                {title}
                <div>{isActive ? '-' : '+'}</div>
            </AccordionTitle>
            {isActive && <AccordionContent>
                <b>{date}</b><br/><br/>
                {content}
            </AccordionContent>}
        </AccordionItem>
    );
};

export default Accordion;