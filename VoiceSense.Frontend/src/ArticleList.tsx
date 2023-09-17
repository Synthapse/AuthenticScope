
import { SetStateAction, useState } from "react";
import { FormSelect, Tooltip } from "shards-react";
import { Dna } from 'react-loader-spinner'
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { IoIosReturnLeft } from "react-icons/io";

import { devices, getCurrentMonthName, getTimePeriodFilters, parseDate, parseDateTime, parseTodayToDate, parseYesterdayToDate } from "./utils";
import techCrunchArticlesArchive from './data/techcrunch.json';
import nyTimesArticlesArchive from './data/nytimes.json';
import deepmindArticlesArchive from './data/deepmind.json';
import mediumArticlesArchive from './data/medium.json';
import LazyArticleLoader from "./LazyArticleList";
import { BsCardChecklist, BsListUl } from "react-icons/bs";

import Menu from "./components/Menu";
import Search from "./components/Search";
interface ISelect {
    options: string[];
    setState: (value: string) => void;
}


// Define color variables
export const primaryColor = "#007bff"; // Blue color
export const secondaryColor = "#17c671"; // Green color
export const tertiaryColor = "#f1f5f9" // Gray color


export interface AIArticle {
    AIArticleLink: string;
    AIArticleTitle: string;
    AIArticleDate: string;
}

const ScrollingFilters = styled.div`
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const Filters = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    width: 100%;
`

const Badge = styled.span`

    width: 100px;
    height: 30px;
    font-size: 15px;
    
    @media ${devices.laptopL} {
        width: 100%;
        font-size: 11px;
        height: 24.5px
      }
`

export const LinkText = styled.div`
    color: ${secondaryColor};
    margin-top: 10px;
    margin-bottom: 10px;
    display:flex;
    align-items: baseline;
    p {
        padding-left: 4px;
    }
    :hover {
        cursor: pointer;
    }
`;

export const HoverDiv = styled.div`
    :hover {
        cursor: pointer;
        > p {
            font-weight: 500;
            transition: 0.2s;
        }
        > a {
            text-decoration: none;
        }
    }
    path {
        stroke: ${primaryColor};
    }
`;

export const Select = ({ options, setState }: ISelect) => {

    return (
        <FormSelect onChange={(e: any) => setState(e)} style={{ width: '200px' }}>
            {options.map((option: string) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </FormSelect>
    );
};

export interface IVoice {
    names: string;
    accent: string;
    age: string;
    description: string;
    gender: string;
    use_case: string;
    voice_id: string;
}

const ArticleList = () => {


    const [loading, setLoading] = useState(false);
    const [techcrunchUrls, setTechcrunchUrls] = useState<AIArticle[]>(techCrunchArticlesArchive);
    const [deepMindUrls, setDeepMindUrls] = useState<AIArticle[]>(deepmindArticlesArchive);
    const [nyTimesUrls, setNyTimesUrls] = useState<AIArticle[]>(nyTimesArticlesArchive);
    const [mediumUrls, setMediumUrls] = useState<AIArticle[]>(mediumArticlesArchive);

    const navigate = useNavigate();

    var currentDate = new Date();
    var lastThreeDays = new Date(currentDate);
    lastThreeDays.setDate(currentDate.getDate() - 3);


    const timePeriodFilters = getTimePeriodFilters();


    //17.10.2023 - active filters for entire month not today -> cause scrappers not automated to work everyday. 
    //Automate scrappers to work everyday and then change to today
    const [activeFilters, setActiveFilters] = useState<string[]>([getCurrentMonthName()]);

    const filterData = (filter: string) => {
        // Check if the filter is already present in activeFilters

        if (filter === 'This year') {
            filter = '2023'
        }

        if (filter === 'Last year') {
            filter = '2022'
        }

        if (filter === 'All') {
            filter = ''
        }

        if (filter === 'Today') {
            filter = parseTodayToDate()
        }

        if (filter === 'Yesterday') {
            filter = parseYesterdayToDate()
        }

        const isFilterActive = activeFilters.includes(filter);

        // Update the activeFilters array
        const updatedFilters = isFilterActive
            ? activeFilters.filter((item) => item !== filter) // Remove the filter if it's active
            : [...activeFilters, filter]; // Add the filter if it's not active

        // Get the filtered data for each category
        const filteredTechcrunch = techCrunchArticlesArchive.filter((item: AIArticle) =>
            updatedFilters.some((filter) => item.AIArticleDate.includes(filter))
        );
        const filteredDeepMind = deepmindArticlesArchive.filter((item: AIArticle) =>
            updatedFilters.some((filter) => item.AIArticleDate.includes(filter))
        );
        const filteredNyTimes = nyTimesArticlesArchive.filter((item: AIArticle) =>
            updatedFilters.some((filter) => item.AIArticleDate.includes(filter))
        );

        const filteredMedium = mediumArticlesArchive.filter((item: AIArticle) =>
            updatedFilters.some((filter) => item.AIArticleDate.includes(filter))
        );

        // Update the states with the filtered data
        setTechcrunchUrls(filteredTechcrunch);
        setDeepMindUrls(filteredDeepMind);
        setNyTimesUrls(filteredNyTimes);
        setMediumUrls(filteredMedium);

        // Update the activeFilters state
        setActiveFilters(updatedFilters);
    };

    const monthsWithWords = (filterTimePeriod: string) => {

        if (filterTimePeriod === 'This year') {
            filterTimePeriod = '2023'
        }

        if (filterTimePeriod === 'Last year') {
            filterTimePeriod = '2022'
        }

        if (filterTimePeriod === 'All') {
            filterTimePeriod = ''
        }


        if (filterTimePeriod === 'Today') {
            filterTimePeriod = parseTodayToDate()
        }

        if (filterTimePeriod === 'Yesterday') {
            filterTimePeriod = parseYesterdayToDate()
        }

        return filterTimePeriod;
    }

    let filteredArticles = techCrunchArticlesArchive.filter((item: AIArticle) =>
        activeFilters.some((filter) => item.AIArticleDate.includes(filter))
    ).concat(deepmindArticlesArchive.filter((item: AIArticle) =>
        activeFilters.some((filter) => item.AIArticleDate.includes(filter))
    )
    ).concat(nyTimesArticlesArchive.filter((item: AIArticle) =>
        activeFilters.some((filter) => item.AIArticleDate.includes(filter))
    )).concat(mediumArticlesArchive.filter((item: AIArticle) =>
        activeFilters.some((filter) => item.AIArticleDate.includes(filter))
    ));


    const totalLength =
        (filteredArticles?.length ?? 0);


    const [isList, setIsList] = useState<boolean>(true)
    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState('')

    const filterExercises = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTerm(event.target.value)
    }



    filteredArticles = !searchTerm
        ? filteredArticles
        : filteredArticles.filter((article: AIArticle) =>
            article.AIArticleTitle.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        )



    return (<div style={{ paddingTop: '5%' }}>
        <Menu />
        {!loading ?
            <>
                <div style={{ width: '260px' }} id="Tooltip">{totalLength} articles in <b>Artificial Intelligence</b><br /><br /></div>
                <Tooltip
                    open={tooltipOpen}
                    target="#Tooltip"
                    toggle={() => setTooltipOpen(!tooltipOpen)}
                >
                    {techCrunchArticlesArchive.filter((item: AIArticle) =>
                        activeFilters.some((filter) => item.AIArticleDate.includes(filter))
                    ).length} TechCrunch articles<br />
                    {deepmindArticlesArchive.filter((item: AIArticle) =>
                        activeFilters.some((filter) => item.AIArticleDate.includes(filter))
                    ).length} DeepMind articles<br />
                    {nyTimesArticlesArchive.filter((item: AIArticle) =>
                        activeFilters.some((filter) => item.AIArticleDate.includes(filter))
                    ).length} NY Times articles<br />
                    {mediumArticlesArchive.filter((item: AIArticle) =>
                        activeFilters.some((filter) => item.AIArticleDate.includes(filter))
                    ).length} Medium articles<br />

                </Tooltip>


                <Search
                    callBack={filterExercises}
                    placeholder={"🔍 What's information you need?"}
                />


                <ScrollingFilters>
                    <Filters>
                        <div style={{ display: 'flex' }}>
                            {timePeriodFilters.map((filterTimePeriod: string, index: number) => (
                                <HoverDiv style={{ marginRight: '10px' }} key={`${filterTimePeriod}-${index}`}>
                                    <Badge
                                        onClick={() => filterData(filterTimePeriod)}
                                        key={filterTimePeriod}
                                        className={`badge badge-pill ${activeFilters.includes(monthsWithWords(filterTimePeriod)) ? 'badge-primary' : 'badge-outline-primary'}`}
                                    >
                                        {filterTimePeriod}
                                    </Badge>
                                </HoverDiv>
                            ))}
                        </div>
                        <HoverDiv>
                            <BsListUl color={!isList ? primaryColor : 'black'} onClick={() => setIsList(!isList)} style={{ width: '28px', height: '28px' }} />
                            <BsCardChecklist color={isList ? primaryColor : 'black'} onClick={() => setIsList(!isList)} style={{ marginLeft: '10px', width: '28px', height: '28px' }} />
                        </HoverDiv>
                    </Filters>
                </ScrollingFilters>
                <LazyArticleLoader
                    articles={filteredArticles
                        .map(article => ({ ...article, AIArticleDate: parseDateTime(article.AIArticleDate) }))
                        .sort((a, b) => new Date(b.AIArticleDate).getTime() - new Date(a.AIArticleDate).getTime())}
                    isList={isList}
                />
            </>
            : <Dna
                visible={true}
                height="80"
                width="80"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
            />
        }
    </div >
    )
}




export default ArticleList;