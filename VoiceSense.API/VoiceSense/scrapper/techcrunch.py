from bs4 import BeautifulSoup
from selenium import webdriver
import time
import json
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

from scrapper.utils import save_array_to_json_file
from scrapper.utils import scroll_page
from scrapper.utils import add_elements_to_json_file


def cookies_popup(driver):
    xpath = '//*[@id="scroll-down-btn"]'
    scroll = driver.find_element(By.XPATH, xpath)
    scroll.click()
    time.sleep(2)
    accept_all_xpath = '//*[@id="consent-page"]/div/div/div/form/div[2]/div[2]/button[1]'
    accept = driver.find_element(By.XPATH, accept_all_xpath)
    accept.click() 
    

def get_article_data(driver, start_index, end_index):
    articles = []
    for i in range(start_index, end_index):
        try:
            xpath = '//*[@id="tc-main-content"]/div/div[2]/div/article[' + str(i) + ']/header/h2/a'
            element = driver.find_element(By.XPATH, xpath)

            text = element.text
            link = element.get_attribute("href")
            xpathDate = '//*[@id="tc-main-content"]/div/div[2]/div/article[' + str(i) + ']/header/div[2]/div/div/time'
            date = driver.find_element(By.XPATH, xpathDate).text

            articles.append({
                'AIArticleLink': link,
                'AIArticleTitle': text,
                'AIArticleDate': date,
            })

        except Exception as e:
            print(f"An exception occurred: {str(e)}")
            continue

    return articles


def scrappe_techcrunch_urls(url, isScrappingArchived=False):

    articles = []
    try:
        # Create a WebDriver instance
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        driver = webdriver.Chrome(chrome_options)
        #driver = webdriver.Chrome()
        driver.get(url)
        cookies_popup(driver)
        print('Scrapping TechCrunch...')
        start_index = 1
        end_index = 19
        batch_size = 20

        articles.extend(get_article_data(driver, start_index, end_index))

        if isScrappingArchived:
            while True:
                # Get articles for the current batch
                print('Starting new iteration...')
                scroll_page(driver)
                scroll_page(driver)
                time.sleep(3)
                scroll_page(driver)
                # Check if "Load More" button exists and click it
                load_more_button = '/html/body/div[2]/div/div/div[3]/div/div[2]/button'
                try:
                    driver.find_element(By.XPATH, load_more_button).click()
                    articles.extend(get_article_data(driver, start_index, end_index))
                    start_index = end_index
                    end_index += batch_size
                except Exception as e:
                    print(f"An exception occurred: {str(e)}")
                    # If "Load More" button is not found, exit the loop
                    break

        add_elements_to_json_file(articles, 'techcrunch')
        save_array_to_json_file(articles, 'techcrunch.json')
        driver.quit()
        return articles
    except Exception as e:
        print(f"An exception occurred: {str(e)}")
        save_array_to_json_file(articles, 'techcrunch.json')
        # If "Load More" button is not found, exit the loop
        driver.quit()


#article = scrappe_techcrunch_urls(url='https://techcrunch.com/category/artificial-intelligence/')