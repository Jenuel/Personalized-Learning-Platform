from pydantic import BaseModel
from typing import List

class FlashcardItem(BaseModel):
    question: str
    answer: str

class GeminiResponse(BaseModel):
    flashcards: List[FlashcardItem]