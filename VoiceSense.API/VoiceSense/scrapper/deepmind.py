from bs4 import BeautifulSoup
from selenium import webdriver
import time
import json
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

from scrapper.utils import save_array_to_json_file
from scrapper.utils import scroll_page
from scrapper.utils import add_elements_to_json_file

# 06.07.2023 - pagination

def scrappe_deepmind_urls(url):

    # Create a WebDriver instance
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--window-size=360,640")

    driver = webdriver.Chrome(chrome_options)
    driver.get(url)
    print('Scrapping DeepMind...')
    articles = []

    for i in range(1, 10):
        try:

            title_xpath = '/html/body/div[6]/div/div/div[2]/div[1]/div[' + str(i) + ']/div[2]/div[1]/h2'
            title = driver.find_element(By.XPATH, title_xpath).text

            if title == '' or title == None:
                title_xpath = '/html/body/div[6]/div/div/div[2]/div[1]/div[' + str(i) + ']/div[1]/div/div[2]/div[1]'
                title = driver.find_element(By.XPATH, title_xpath).text


            xpath = '/html/body/div[6]/div/div/div[2]/div[1]/div[' + str(i) + ']/div[2]/a'
            element = driver.find_element(By.XPATH, xpath)
            link = element.get_attribute("href")

            date_xpath = '/html/body/div[6]/div/div/div[2]/div[1]/div[' + str(i) + ']/div[2]/div[1]/div[2]/div'
            date = driver.find_element(By.XPATH, date_xpath).text

            if date == '' or date == None:
                date_xpath = '/html/body/div[6]/div/div/div[2]/div[1]/div[' + str(i) + ']/div[1]/div/div[2]/div[2]'
                date = driver.find_element(By.XPATH, title_xpath).text

            articles.append({
                'AIArticleLink': link,
                'AIArticleTitle': title,
                "AIArticleDate": date,
            })
        except Exception as e:
            print(f"An exception occurred: {str(e)}")
            continue

    add_elements_to_json_file(articles, 'deepmind')
    save_array_to_json_file(articles, 'deepmind.json')
    driver.quit()
    return articles


