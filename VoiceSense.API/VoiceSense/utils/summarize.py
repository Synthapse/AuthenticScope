import requests
import json

def format_description(input_text):
    # Replace '%20' with spaces
    formatted_text = input_text.replace('%20', ' ')
    
    # Add line breaks after each colon (':') for better readability
    formatted_text = formatted_text.replace(':', ':\n')
    
    return formatted_text

def summarize_text(text="",url=""):
    _url = "https://api.ai21.com/studio/v1/summarize"
    token = "To0TSwbaSFhc8XcMykbLxInNWh5gFmef"
    

    if text:
        print(format_description(text))
        payload = { "sourceType": "TEXT",
                    "source": format_description(text) }
    elif url:
        payload = { "sourceType": "URL",
                    "source": url }
    else:
        return -1

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": "Bearer " + token
    }


    print('Connecting with Jurassic AI:')
    response = requests.post(_url, json=payload, headers=headers)

    print(response)

    summary = json.loads(response.text)
    return summary['summary']