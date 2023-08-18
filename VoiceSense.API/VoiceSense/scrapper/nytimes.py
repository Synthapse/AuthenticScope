from bs4 import BeautifulSoup
from selenium import webdriver
from datetime import datetime
import time
import json
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

from scrapper.utils import save_array_to_json_file
from scrapper.utils import scroll_page, scroll_page_up
from scrapper.utils import add_elements_to_json_file


def parse_and_format_date(date_string):
    try:
        parsed_date = datetime.strptime(date_string, "%B %d, %Y")
        formatted_date = parsed_date.strftime("%B %d, %Y")
    except ValueError:
        try:
            parsed_date = datetime.strptime(date_string, "%b. %d, %Y")
            formatted_date = parsed_date.strftime("%B %d, %Y")
        except ValueError:
            formatted_date = f"Unable to parse: {date_string}"
    
    return formatted_date

def accept_terms(driver):
    try:
        xpath = '/html/body/div[2]/div/button'
        acccept_terms_button = driver.find_element(By.XPATH, xpath)
        acccept_terms_button.click()
        time.sleep(2)
    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        pass


def extract_articles(driver, start, end):
    articles = []

    for i in range(start, end):
        try:
            title_xpath = '/html/body/div[1]/div[2]/main/section/div[2]/div/section/div[1]/ol/li[' + str(i) + ']/div/article/a'
            element = driver.find_element(By.XPATH, title_xpath)

            text = element.text
            link = element.get_attribute("href")

            date_xpath = '/html/body/div[1]/div[2]/main/section/div[2]/div/section/div[1]/ol/li[' + str(i) + ']/div/div/span'
            date = driver.find_element(By.XPATH, date_xpath)
            articles.append({
                'AIArticleLink': link,
                'AIArticleTitle': text,
                "AIArticleDate": parse_and_format_date(date.text)
            })

        except Exception as e:
            print(f"An exception occurred: {str(e)}")
            continue

    return articles

def scrappe_nytimes_urls(url, isScrappingArchived=False):
    # Create a WebDriver instance
    chrome_options = Options()
    chrome_options.add_argument("--headless")

    driver = webdriver.Chrome(chrome_options)
    #driver = webdriver.Chrome()
    driver.get(url)
    print('Scrapping NYTimes...')
    articles = []
    accept_terms(driver)
    scroll_page(driver)

    if isScrappingArchived:
        article_ranges = [
            (1, 11), (10, 20), (20, 30), (30, 40), (40, 50), (50, 60), (60, 70), (70, 80), (80, 90), (90, 100),
            (100, 110), (110, 120), (120, 130), (130, 140), (140, 150), (150, 160), (160, 170), (170, 180), (180, 190), (190, 200),
            (200, 210), (210, 220), (220, 230), (230, 240), (240, 250), (250, 260), (260, 270), (270, 280), (280, 290), (290, 300),
            (300, 310), (310, 320), (320, 330), (330, 340), (340, 350), (350, 360), (360, 370), (370, 380), (380, 390), (390, 400),
            (400, 410), (410, 420), (420, 430), (430, 440), (440, 450), (450, 460), (460, 470), (470, 480), (480, 490), (490, 500),
            (500, 510), (510, 520), (520, 530), (530, 540), (540, 550), (550, 560), (560, 570), (570, 580), (580, 590), (590, 600),
            (600, 610), (610, 620), (620, 630), (630, 640), (640, 650), (650, 660), (660, 670), (670, 680), (680, 690), (690, 700),
            (700, 710), (710, 720), (720, 730), (730, 740), (740, 750), (750, 760), (760, 770), (770, 780), (780, 790), (790, 800),
        ]
    else:
        article_ranges = [(1,11), (10,20)]

    for start, end in article_ranges:
        articles.extend(extract_articles(driver, start, end))
        print('Starting new iteration...')
        scroll_page_up(driver)
        scroll_page(driver)
    
    add_elements_to_json_file(articles, 'nytimes')
    save_array_to_json_file(articles, 'nytimes.json')
    driver.quit()
    return articles

