import json
import time
from datetime import datetime, timedelta

def add_elements_to_json_file(new_articles, file_name):
    # Step 1: Read existing JSON data
    json_file_path = f'../../VoiceSense.Frontend/src/data/{file_name}.json'

    # Step 1: Read existing JSON data
    try:
        with open(json_file_path, 'r') as json_file:
            existing_data = json.load(json_file)
    except FileNotFoundError:
        existing_data = []

    new_articles_to_add = []
    # Step 2: Check if articles are already present
    for new_article in new_articles:
        link_to_add = new_article["AIArticleLink"]
        if not any(item["AIArticleLink"] == link_to_add for item in existing_data):
            # Step 3: Add new article to the data
            new_articles_to_add.append(new_article)

    print(new_articles_to_add)
    new_data = new_articles_to_add + existing_data

    # Step 4: Write updated JSON data back to the file
    with open(json_file_path, 'w') as json_file:
        json.dump(new_data, json_file, indent=4)

    print(f"File'{json_file_path} modified, added {len(new_articles_to_add)}'.")



def add_elements_to_json_file(new_articles, file_name):
    # Step 1: Read existing JSON data
    json_file_path = f'../../VoiceSense.Frontend/src/data/{file_name}.json'

    # Step 1: Read existing JSON data
    try:
        with open(json_file_path, 'r') as json_file:
            existing_data = json.load(json_file)
    except FileNotFoundError:
        existing_data = []

    new_articles_to_add = []
    # Step 2: Check if articles are already present
    for new_article in new_articles:
        link_to_add = new_article["AIArticleLink"]
        if not any(item["AIArticleLink"] == link_to_add for item in existing_data):
            # Step 3: Add new article to the data
            new_articles_to_add.append(new_article)

    print(new_articles_to_add)
    new_data = new_articles_to_add + existing_data

    # Step 4: Write updated JSON data back to the file
    with open(json_file_path, 'w') as json_file:
        json.dump(new_data, json_file, indent=4)

    print(f"File'{json_file_path} modified, added {len(new_articles_to_add)}'.")

def save_array_to_json_file(data_array, file_path):
    with open(file_path, 'w') as json_file:
        json.dump(data_array, json_file)
    print(f"File'{file_path} saved, added {len(data_array)}'.")

def smooth_scroll(driver, scroll_to, duration) -> None:
    # Get the current scroll position
    current_scroll = driver.execute_script("return window.pageYOffset;")
    # Calculate the distance to scroll
    distance = scroll_to - current_scroll
    # Calculate the number of steps for smooth scrolling
    steps = 30  # You can adjust this value to control the smoothness
    step_size = distance / steps
    # Perform smooth scrolling
    for _ in range(steps):
        current_scroll += step_size
        driver.execute_script(f"window.scrollTo(0, {current_scroll});")
        time.sleep(duration / steps)

def scroll_page(driver) -> None:
    # Scroll down the page
    smooth_scroll(driver, scroll_to=driver.execute_script("return document.body.scrollHeight;"), duration=0.5)
    # Wait for some time to allow the page to load
    time.sleep(3)

def scroll_page_up(driver) -> None:
    # Scroll down the page
    smooth_scroll(driver, scroll_to=0, duration=0.5)
    # Wait for some time to allow the page to load
    time.sleep(3)

def convert_article_date(article_date):
    try:
        # Extract the date part after the '·'
        date_str = article_date.split("·")[-1].strip()
        
        if "day ago" in date_str:
            days_ago = int(date_str.split()[0])
            date = datetime.now() - timedelta(days=days_ago)
        elif "days ago" in date_str:
            days_ago = int(date_str.split()[0])
            date = datetime.now() - timedelta(days=days_ago)
        elif "hours ago" in date_str:
            hours_ago = int(date_str.split()[0])
            date = datetime.now() - timedelta(hours=hours_ago)
        else:
            date = datetime.strptime(date_str, "%b %d")
            if date.month > datetime.now().month:
                date = date.replace(year=datetime.now().year - 1)
            else:
                date = date.replace(year=datetime.now().year)
        
        formatted_date = date.strftime("%B %d, %Y")

        if formatted_date is None or formatted_date == "": 
            today_date = datetime.now().strftime("%B %d, %Y")
            formatted_date = today_date

        return formatted_date
    except Exception as e:
        print("Error parsing date:", e)
        return None

