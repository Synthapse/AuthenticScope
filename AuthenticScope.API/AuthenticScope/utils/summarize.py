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


# 27.12 - changing Jurrasic AI to Google Service (?)

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