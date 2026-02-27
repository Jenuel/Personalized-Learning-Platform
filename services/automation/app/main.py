from fastapi import FastAPI, UploadFile, File
from app.controllers.file_extraction import extract_text
from app.controllers.flashcard_generation import generate_response, parse_flashcards_json, save_flashcards
from app.database import Base, engine, SessionLocal
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def init_db():
    Base.metadata.create_all(bind=engine)

@app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI Automation Application"}

@app.post("/upload")
async def handle_file(file: UploadFile = File(...)):
    try:
        text = await extract_text(file)
        flashcards_raw = await generate_response(text)

        flashcards = parse_flashcards_json(flashcards_raw)
        db_flashcards = save_flashcards(SessionLocal(), flashcards)

        return {"flashcards": db_flashcards, "status": "success"}
    except Exception as e:
        print(f"[ERROR] {e}")
        return {"message": f"An unexpected error occurred: {str(e)}", "status": "error"}