from typing import Annotated
import time
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import StreamingResponse
from utils.summarize import summarize_text
from utils.audiogen import audio_generator, chat_to_audio
from utils.get_voice_id import get_voice_id
from pydantic import BaseModel
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from datetime import datetime

from scrapper.deepmind import scrappe_deepmind_urls
from scrapper.nytimes import scrappe_nytimes_urls
from scrapper.techcrunch import scrappe_techcrunch_urls
from scrapper.medium import scrappe_medium_urls

import pandas as pd
import io
import os
import stripe
from dotenv import load_dotenv

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "https://storage.googleapis.com",
    "https://storage.googleapis.com/voicesense",
    "https://storage.googleapis.com/voicesense/index.html"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sessionid = os.getsid(0)
print("Session ID: ", sessionid)
sessionid2 = int(time.time())


load_dotenv(dotenv_path="./.env.test")
stripe.api_key = os.environ.get("STRIPE_KEY")

@app.post('/paymentTest')
async def paymentTest():


    
    try:
        domain_url = os.getenv("DOMAIN") or "http://localhost:3000"
        # need to know the information about user, which product he bought, and the price
        userId = "test",
        productId = "subscription"
        print(domain_url)

        checkout_session = stripe.checkout.Session.create(
            success_url=domain_url + "#/order-confirmation?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=domain_url + "/#/cancel",
            # client_reference_id=userId,
            payment_method_types=["card"],
            mode="payment",
            metadata={"product_id": productId},
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": 199,
                        "product_data": {
                            "name": "AI Voice",
                        }
                    },
                    "quantity": 1,
                }
            ]
        )

        print(checkout_session)

        return JSONResponse(content=checkout_session.url, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)  


@app.get('/nytimes')
async def nytimesURLS():
    try:
        urls = scrappe_nytimes_urls("https://www.nytimes.com/spotlight/artificial-intelligence")
        return JSONResponse(content=urls)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get('/deepMindUrls')
async def deepMindUrls():
    try:
        urls = scrappe_deepmind_urls("https://deepmind.com/blog")
        return JSONResponse(content=urls)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/techcrunchUrls")
async def scrappeUrls():
    try:
        urls = scrappe_techcrunch_urls("https://techcrunch.com/category/artificial-intelligence/")
        return JSONResponse(content=urls)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/mediumUrls")
async def scrappeUrls():
    try:
        urls = scrappe_medium_urls("https://medium.com/tag/artificial-intelligence/recommended")
        return JSONResponse(content=urls)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/summarize")
async def summarizeText(url: str = None, text: str = None):
    try:
        if(url == None and text == None):
            return "Please provide either a url or text"
        
        summarization_text = summarize_text(text, url)
        print("Summarization Text: " + summarization_text)
        return summarization_text
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
        
@app.get("/audioGenerate")
async def generate_audio(summarization_text: str = None, accent: str = None, age:str = None, description:str = None, gender:str = None, useCase:str = None):

    voice_id = get_voice_id(accent, age, gender, description, useCase)
    print("VoiceID: " + str(voice_id))
    audio_data = audio_generator(summarization_text,filename=sessionid, voiceid = str(voice_id))

    # Assuming you have the audio data as bytes in 'audio_summary'
    return StreamingResponse(audio_data, media_type="audio/mpeg")

@app.get("/voices")
async def voices():
    df = pd.read_csv('utils/voices_id.csv')
    df = df.drop('Unnamed: 0',axis=1)
    voices = []
    for i in range(len(df)):
        voices.append(df.loc[i].to_dict())
    return voices

@app.get("/files")
async def getFiles():
    with open(f'audio_output_files/{sessionid}.mpeg', "rb") as file:
        output_file = io.BytesIO(file.read())
        return StreamingResponse(output_file, media_type="audio/mpeg")

@app.post("/upload")
async def upload(
    file: UploadFile = File(...),
    firstPersonVoiceId: str = Form(...),
    secondPersonVoiceId: str = Form(...)
):
    try:

        # current_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        filename = 'utils/chat.txt'
        print('Audio is generating....')
        with open(filename, "wb") as output_file:
            while chunk := file.file.read(1024):
                output_file.write(chunk)
        chat_to_audio(filename, firstPersonVoiceId, secondPersonVoiceId, filename=sessionid)
        print('Audio generated!')
        return JSONResponse(content={"message": "Audio generated successfully",
                                     "session id": sessionid})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(content={"error": "Validation error: " + str(exc)}, status_code=400)
