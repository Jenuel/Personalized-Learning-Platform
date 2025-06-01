from fastapi import File, UploadFile, HTTPException
from PyPDF2 import PdfReader
from typing import List, Dict
from google import genai
from google.generativeai.types import Content, Part, GenerateContentConfig
import base64
import os
import json

async def handle_file_upload(file: UploadFile = File(...)):
    try:
        file_type = check_file_type(file)

        if file_type == "application/pdf":
            text = await extract_text_from_pdf(file)
        elif file_type == "text/plain":
            text = await extract_text_from_text(file)

        response = await generate_response(text)
        flashcards = parse_flashcards_json(response)
        # Save to the database
        
        return { "message": "File processed successfully" }

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the file: {str(e)}"
        )

def check_file_type(file: UploadFile):
    allowed_types = ["text/plain", "application/pdf"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only text and PDF files are allowed.")
    
    return True

def extract_text_from_pdf(file: UploadFile) -> str:
    reader = PdfReader(file.file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text 


def extract_text_from_text(file: UploadFile):
    content = file.file.read()
    return content.decode("utf-8") if isinstance(content, bytes) else content

def generate_response(text: str) -> List[Dict[str, str]]:
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    prompt = (
        ""
    )

    contents = [
        Content(
            role="user",
            parts=[Part.from_text(prompt)],
        )
    ]

    config = GenerateContentConfig(response_mime_type="text/plain")

    response_text = ""
    for chunk in client.models.generate_content_stream(
        model="gemini-2.5-flash-preview-04-17",
        contents=contents,
        config=config,
    ):
        if chunk.text:
            response_text += chunk.text

    return response_text


def parse_flashcards_json(response_text: str) -> List[Dict[str, str]]:
    try:
        flashcards = json.loads(response_text)
        if isinstance(flashcards, list) and all(
            isinstance(card, dict) and "question" in card and "answer" in card for card in flashcards
        ):
            return flashcards
        else:
            raise ValueError("Malformed flashcards format.")
    except Exception as e:
        raise ValueError(f"Failed to parse Gemini response as JSON. Raw response:\n{response_text}") from e

