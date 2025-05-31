from fastapi import FastAPI, UploadFile, File
from app.controllers.file_controllers import handle_file_upload

app = FastAPI()


app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI Automation Application"}

app.post("/upload")
async def handle_file(file: UploadFile = File(...)):
    return await handle_file_upload(file)
