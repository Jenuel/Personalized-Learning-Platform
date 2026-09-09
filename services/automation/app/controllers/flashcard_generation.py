import os
import json
import re
from google import genai
from google.genai import types
from sqlalchemy.orm import Session
from app.models.flashcard import Flashcard, CardMetadata
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

async def generate_response(text: str) -> List[Dict[str, str]]:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY not found in environment variables.")
        return []

    client = genai.Client(api_key=GEMINI_API_KEY)

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
        thinking_config=types.ThinkingConfig(thinking_budget=-1)
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

        if isinstance(json_data, list):
            return json_data
        else:
            raise ValueError("Gemini did not return a list of flashcards.")

    except json.JSONDecodeError as e:
        print(f"[JSON ERROR] {e}\nRaw response: {response_text}")
    except Exception as e:
        print(f"[UNEXPECTED ERROR] {e}\nRaw response: {response_text}")

    return []

def parse_flashcards_json(flashcards: List[Dict[str, str]]) -> List[Dict[str, str]]:
    if isinstance(flashcards, list) and all(
        isinstance(card, dict) and "question" in card and "answer" in card for card in flashcards
    ):
        return flashcards
    raise ValueError("Flashcards format is invalid.")

def save_flashcards(db: Session, flashcards: List[Dict[str, str]]):
    if not flashcards:
        print("No flashcards to save.")
        return []

    saved_flashcards = []

    for fc in flashcards:
        try:
            flashcard = Flashcard(
                question=fc["question"], 
                answer=fc["answer"],
                card_metadata=CardMetadata()
            )
            db.add(flashcard)
            saved_flashcards.append(flashcard)
        except KeyError as e:
            print(f"[KeyError] Missing key: {e} — {fc}")
        except Exception as e:
            print(f"[Error] Could not add flashcard: {e} — {fc}")

    try:
        db.commit()
        for flashcard in saved_flashcards:
            db.refresh(flashcard)
        print(f"Saved {len(saved_flashcards)} flashcards.")
        return saved_flashcards
    except Exception as e:
        db.rollback()
        print(f"[Commit Error] {e}")
        return []