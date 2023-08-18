from bs4 import BeautifulSoup
from selenium import webdriver
import time
import json
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

# from scrapper.utils import save_array_to_json_file
# from scrapper.utils import scroll_page
# from scrapper.utils import add_elements_to_json_file

from scrapper.utils import save_array_to_json_file
from scrapper.utils import scroll_page, scroll_page_up
from scrapper.utils import add_elements_to_json_file
from scrapper.utils import convert_article_date


def extract_articles(driver, start, end):
    articles = []

    for i in range(start, end):
        try:
            title_xpath = '/html/body/div/div/div[3]/div[2]/div/div[4]/div/div[1]/div[' + str(i) + ']/article/div/div/div/div/div[2]/div[1]/a[1]/h2'
            title = driver.find_element(By.XPATH, title_xpath).text

            xpath = '/html/body/div/div/div[3]/div[2]/div/div[4]/div/div[1]/div[' + str(i) + ']/article/div/div/div/div/div[2]/div[1]/a[1]'
            element = driver.find_element(By.XPATH, xpath)
            link = element.get_attribute("href")

            date_xpath = '/html/body/div/div/div[3]/div[2]/div/div[4]/div/div[1]/div[' + str(i) + ']/article/div/div/div/div/div[2]/div[1]/a[2]/span/div'
            date = driver.find_element(By.XPATH, date_xpath)

            articles.append({
                'AIArticleLink': link,
                'AIArticleTitle': title,
                "AIArticleDate": convert_article_date(date.text),
            })

        except Exception as e:
            print(f"An exception occurred: {str(e)}")
            continue

    return articles


def scrappe_medium_urls(url, isScrappingArchived=True):

    # Create a WebDriver instance
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--window-size=360,640")

    driver = webdriver.Chrome(chrome_options)
    driver.get(url)
    print('Scrapping Medium...')
    articles = []

    if isScrappingArchived:
        article_ranges = [
            (1, 11), (10, 20), (20, 30), (30, 40), (40, 50), (50, 60), (60, 70), (70, 80), (80, 90), (90, 100),
            (100, 110), (110, 120), (120, 130), (130, 140), (140, 150), (150, 160), (160, 170), (170, 180), (180, 190), (190, 200),
            (200, 210), (210, 220), (220, 230), (230, 240), (240, 250), (250, 260), (260, 270), (270, 280), (280, 290), (290, 300),
        ]
    else:
        article_ranges = [(1,11), (10,20)]

    for start, end in article_ranges:
        articles.extend(extract_articles(driver, start, end))
        print('Starting new iteration...')
        scroll_page_up(driver)
        scroll_page(driver)
    
    add_elements_to_json_file(articles, 'medium')
    save_array_to_json_file(articles, 'medium.json')
    driver.quit()
    return articles



# articles = scrappe_medium_urls(url='https://medium.com/tag/artificial-intelligence/recommended')
# print(articles)