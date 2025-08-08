import os
import json
import re
from google import genai
from google.genai import types
from sqlalchemy.orm import Session
from app.models.flashcard import Flashcard
from typing import List, Dict
from dotenv import load_dotenv
from pydantic import ValidationError
from app.schema.flashcard_schema import GeminiResponse

load_dotenv()

async def generate_response(text: str) -> List[Dict[str, str]]:

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY not found in environment variables.")
        return None
    
    client = genai.Client(
        api_key=GEMINI_API_KEY,
    )

    prompt = f"""
    You are a helpful assistant that creates study flashcards.

    Based on the study material below, generate flashcards in this exact JSON format:
    [
    {{"question": "What is ...?", "answer": "Your answer here"}},
    ...
    ]

    Important:
    - Use only double quotes (") for keys and values to comply with JSON standards.
    - Return only valid JSON.
    - Do not include any explanation or extra text.

    Study Material:
    {text}
    """


    response_text = ""

    model = "gemini-2.5-pro"

    contents = [
        types.Content(
            role="user",
            parts=[types.Part(text=prompt)],
        ),
    ]

    generate_content_config = types.GenerateContentConfig(
        thinking_config = types.ThinkingConfig(
            thinking_budget = -1,
        ),
    )

    try:
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):  
            
            if chunk.text:
                response_text += chunk.text
        
        cleaned_response_text = re.sub(r"^```(?:json)?|```$", "", response_text.strip(), flags=re.MULTILINE).strip()

        json_data = json.loads(cleaned_response_text)
        
        return json_data

    except json.JSONDecodeError as e:
        print(f"JSON decoding error: {e}")
        print(f"1Raw response text: {response_text}")
    except ValidationError as e:
        print(f"Pydantic validation error: {e}")
        print(f"2Raw response text: {response_text}")
    except Exception as e:
        print(f"Unexpected error during API call or response processing: {e}")
        print(f"3Raw response text: {response_text}")

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