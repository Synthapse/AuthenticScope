import requests
import io
import pandas as pd
from utils.conversations.whatsapp_module import whatsapp_chat_to_list, whatsapp_chatfile_to_list, append_audio_to_mpeg

def audio_generator(text,filename,voiceid = '21m00Tcm4TlvDq8ikWAM',audio_format='mpeg',stability=0.5,similarity_boost=0.5,chunk_size=1024,file_save = False):
    
    api_key = "8f589ce7779f7442140fbd66799d837b"
    api_key2 = "c1b0f41b64f89eac30d102137823c11e"

    print ('Generating voice for voice id: ' ,voiceid)

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voiceid}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": api_key2
    }

    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": stability,
            "similarity_boost": similarity_boost
        }
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 200:
        if file_save:
            with open(f"audio_output_files/{filename}.{audio_format}", 'wb') as f:
                for chunk in response.iter_content(chunk_size=chunk_size):
                    if chunk:
                        f.write(chunk)
        audio_data = io.BytesIO(response.content)
        return audio_data
    else:
        print(f"Error: {response.status_code} - {response.text}")



def chat_to_audio(chat,personone,persontwo,filename):

    if chat.endswith('.txt'):
        chat_list = whatsapp_chatfile_to_list(chat)
    else:
        chat_list = whatsapp_chat_to_list(chat)

    # print(len(chat_list))
    # print(chat_list)

    # df = pd.read_csv('voices_id.csv')
    # persononevoice_id = df[df['names']==personone]['voice_id'].values[0]
    # persontwovoice_id = df[df['names']==persontwo]['voice_id'].values[0]

    for i in range(len(chat_list)):
        if i==0:
            audio_generator(chat_list[0],voiceid=personone,filename = filename,file_save=True)
        elif (i+1)%2==1:
            audio = audio_generator(chat_list[i],voiceid=personone,filename = filename)
            append_audio_to_mpeg(f'audio_output_files/{filename}.mpeg', audio)
        else:
            audio = audio_generator(chat_list[i],voiceid=persontwo,filename = filename)
            append_audio_to_mpeg(f'audio_output_files/{filename}.mpeg', audio)