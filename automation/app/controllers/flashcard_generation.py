import os
import json
from google import genai
from sqlalchemy.orm import Session
from app.models.flashcard import Flashcard
from typing import List, Dict
from dotenv import load_dotenv
from pydantic import ValidationError
from app.schema.flashcard_schema import GeminiResponse

load_dotenv()

def generate_response(text: str) -> List[Dict[str, str]]:

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY not found in environment variables.")
        return None

    genai.configure(api_key=GEMINI_API_KEY)

    prompt = (
        f"Generate a list of flashcards (question and answer pairs) based on the following text. "
        f"Format the output as a JSON object with a single key 'flashcards', "
        f"which contains a list of objects, each with 'question' and 'answer' keys. "
        f"Ensure there are at least 3-5 flashcards generated if possible, and no more than 10. "
        f"Keep questions concise and answers informative.\n\nText: \"{text}\""
    )

    response_text = ""

    model = genai.GenerativeModel('gemini-2.5-flash-preview-04-17')
    try:

        for chunk in model.generate_content(
            [prompt],
            stream=True,  
            generation_config={
                "response_mime_type": "application/json",
                "temperature": 0.3
            },
        ):
            
            if chunk.text:
                response_text += chunk.text
        
        json_data = json.loads(response_text)
        parsed_response = GeminiResponse(**json_data)

        return [card.model_dump() for card in parsed_response.flashcards]

    except json.JSONDecodeError as e:
        print(f"JSON decoding error: {e}")
        print(f"Raw response text: {response_text}")
    except ValidationError as e:
        print(f"Pydantic validation error: {e}")
        print(f"Raw response text: {response_text}")
    except Exception as e:
        print(f"Unexpected error during API call or response processing: {e}")
        print(f"Raw response text: {response_text}")

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
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to decode JSON: {e}. Raw response:\n{response_text}") from e
    except Exception as e:
        raise ValueError(f"Failed to parse Gemini response as JSON. Raw response:\n{response_text}") from e


def save_flashcards(db: Session, flashcards: List[Dict[str, str]]):
    if not flashcards:
        print("No flashcards to save.")
        return
    
    for fc in flashcards:
        try:
            flashcard = Flashcard(question=fc["question"], answer=fc["answer"])
            db.add(flashcard)
        except KeyError as e:
            print(f"Skipping flashcard due to missing key: {e}. Flashcard data: {fc}")
            continue
        except Exception as e:
            print(f"Error adding flashcard to session: {e}. Flashcard data: {fc}")
            continue

    try:
        db.commit()
        print(f"Successfully saved {len(flashcards)} flashcards to the database.")
    except Exception as e:
        db.rollback() 
        print(f"Error committing flashcards to database: {e}")