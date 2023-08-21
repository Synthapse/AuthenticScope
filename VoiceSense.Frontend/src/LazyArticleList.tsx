import { useState, useRef, useEffect } from "react";
import { GrArticle, GrFormNextLink } from "react-icons/gr";
import { Dna } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { AIArticle, HoverDiv, primaryColor } from "./Demo";
import { parseDateTime } from "./utils";
import styled from "styled-components";

interface ILazyArticleLoader {
    articles: AIArticle[];
    isList: boolean
}


const ArticleListItem = styled.div`
    display: flex;
    border-bottom-width: 1px;
    border-top-width: 0;
    border-left-width: 0;
    border-right-width: 0;
    border-color: #808080;
    border-style: solid;
    padding-bottom: 10px;
    padding-top: 10px;

    :hover {
        cursor: pointer;
    }

    &:first-child {
        border-top-width: 1px;
    }

    > h1 {
        margin-top: 0px;
        margin-bottom: 0px;
        font-size: 18px;
        font-weight: bold;
        color: #212529; 
    }

    > div {
        display: none;
    } 
`

const ArticleListElement = styled.div`
    border-bottom-width: 1;
    border-top-width: 0;
    border-left-width: 0;
    border-right-width: 0;
    border-color: #808080;
    border-style: solid;
    margin-bottom: 20px;
    
    > h1 {
        font-size: 24px;
        font-weight: bold;
        line-height: 1.45;
        color: #212529; 
    }
`


const LazyArticleLoader = ({ articles, isList }: ILazyArticleLoader) => {
    const [visibleArticles, setVisibleArticles] = useState<AIArticle[]>([]);
    const observer: any = useRef();

    const navigate = useNavigate();

    const navigateToArticle = (article: AIArticle) => {
        navigate('/article', { state: { article: article } });
    }

    useEffect(() => {

        observer.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "0px",
            threshold: 0.1,
        });

        if (visibleArticles.length < articles.length) {
            observer.current.observe(document.querySelector("#sentinel"));
        }
        return () => {
            observer.current.disconnect();
        };
    }, [visibleArticles, articles]);

    const handleObserver = (entries: IntersectionObserverEntry[]) => {

        const target = entries[0];
        if (target.isIntersecting) {
            // Load more articles when the user reaches the bottom
            const batchSize = 15; // Adjust the batch size according to your needs
            const endIndex = visibleArticles.length + batchSize;
            setVisibleArticles(articles.slice(0, endIndex));
        }
    };


    const filteredArticles = visibleArticles.filter((article: AIArticle) => {
        if (!articles.includes(article)) {
            return null;
        }
        return article;
    })

    const updatedFilteredArticles = articles.slice(0, visibleArticles.length).concat(filteredArticles.slice(visibleArticles.length)).filter((element) => element !== undefined);
    const SelectedComponent = isList ? ArticleListElement : ArticleListItem;

    return (
        <div>
            {updatedFilteredArticles?.length > 0 ? (
                updatedFilteredArticles.map((article: AIArticle, index: number) => (
                    <SelectedComponent key={index} onClick={!isList ? () => navigateToArticle(article) : undefined}>
                        <h1>{article.AIArticleTitle}</h1>
                        <div>
                            <div style={{ display: 'flex', marginTop: '20px' }}>
                                <p>{article.AIArticleLink.replace(/^(https?:\/\/)?(www\.)?/i, '').split('/')[0]} • </p><p style={{ marginLeft: '5px' }}>{article.AIArticleDate} </p>
                            </div>
                        </div>
                        <HoverDiv>
                            <div style={{ display: 'flex', color: primaryColor }}>
                                <div style={{ marginRight: '20px' }} onClick={() => navigateToArticle(article)}>
                                    <p>
                                        <GrFormNextLink style={{ marginRight: '10px' }} />
                                        Summarize
                                    </p>
                                </div>
                                <a href={article.AIArticleLink} target="_blank" rel="noopener noreferrer">
                                    <p>
                                        <GrArticle style={{ marginRight: '10px' }} />
                                        View article
                                    </p>
                                </a>
                            </div>
                        </HoverDiv>
                    </SelectedComponent>
                ))
            ) : (
                <>
                    <Dna
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="dna-loading"
                        wrapperStyle={{}}
                        wrapperClass="dna-wrapper"
                    />
                </>
            )}
            <div id="sentinel" style={{ height: "10px" }}></div>
        </div>
    );
};

export default LazyArticleLoader;