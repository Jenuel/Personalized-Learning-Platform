import os
import json
from google import genai
from sqlalchemy.orm import Session
from models.flashcard import Flashcard
from typing import List, Dict
from app.database import SessionLocal



def generate_response(text: str) -> List[Dict[str, str]]:

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=GEMINI_API_KEY)

    prompt = (
        ""
    )

    response_text = ""

    model = genai.GenerativeModel('gemini-2.5-flash-preview-04-17') 

    for chunk in model.generate_content(
        [prompt],
        stream=True,  
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.0
        },
    ):
        if chunk.text:
            response_text += chunk.text
        
    try:
        # Parse the JSON string
        json_data = json.loads(response_text)
        # Validate and parse with Pydantic model
        parsed_response = GeminiResponse(**json_data)
        return parsed_response

    except json.JSONDecodeError as e:
        print("JSON decoding error:", e)
    except ValidationError as e:
        print("Pydantic validation error:", e)
    except Exception as e:
        print("Unexpected error:", e)

    return None  


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


def save_flashcards(db: Session, flashcards: List[Dict[str, str]]):
    for fc in flashcards:
        flashcard = Flashcard(question=fc["question"], answer=fc["answer"])
        db.add(flashcard)
    db.commit()