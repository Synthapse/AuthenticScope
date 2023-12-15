

pip3 install "uvicorn[standard]"
pip3 install fastapi

uvicorn main:app --reload
http://127.0.0.1:8000/docs