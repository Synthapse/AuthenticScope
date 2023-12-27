import requests
import json
# import vertexai
# from vertexai.language_models import TextGenerationModel

def format_description(input_text):
    # Replace '%20' with spaces
    formatted_text = input_text.replace('%20', ' ')
    
    # Add line breaks after each colon (':') for better readability
    formatted_text = formatted_text.replace(':', ':\n')
    
    return formatted_text

# def summarize_text(text="", url=""):

#         vertexai.init(project="voicesense")
#         parameters = {
#             "temperature": 0.2,  # Temperature controls the degree of randomness in token selection.
#             "max_output_tokens": 256,  # Token limit determines the maximum amount of text output.
#             "top_p": 0.95,  # Tokens are selected from most probable to least until the sum of their probabilities equals the top_p value.
#             "top_k": 40,  # A top_k of 1 means the selected token is the most probable among all tokens.
#         }
#         model = TextGenerationModel.from_pretrained("text-bison@001")
#         response = model.predict("${url}", **parameters,)
#         print(f"Response from Model: {response.text}")

def summarize_text(text="",url=""):
    _url = "https://api.ai21.com/studio/v1/summarize"
    token = "An98AF6Sk9rG0TTzs1TKCV7FuKtDhzkb"

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
    try:
        response = requests.post(_url, json=payload, headers=headers)
        print(response)
    except(ex):
        print(ex)
        return ex

    summary = json.loads(response.text)
    return summary['summary'].replace("None", "")