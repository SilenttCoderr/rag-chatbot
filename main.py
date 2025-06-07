from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from rag import rag_function, into_database  # your module
from fastapi.middleware.cors import CORSMiddleware

import shutil

app = FastAPI()


from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "https://rag-chatbot-l9iehc6sb-silenttcoderrs-projects.vercel.app",  # Add your frontend domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/query")
def ask_question(query: dict):
    response = rag_function(query["query"])
    return {"response": response.content if hasattr(response, 'content') else str(response)}

@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    into_database(file.filename)
    return {"status": "uploaded"}
