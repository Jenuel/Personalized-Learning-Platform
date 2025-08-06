from fastapi import FastAPI, UploadFile, File
from app.controllers.file_extraction import extract_text
from app.controllers.flashcard_generation import generate_response, parse_flashcards_json, save_flashcards
from app.database import Base, engine
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


app.get("/")
async def read_root():
    return {"message": "Welcome to the FastAPI Automation Application"}

app.post("/upload")
async def handle_file(file: UploadFile = File(...)):
    try:
        text = await extract_text(file)
        print(f"Extracted text: {text[:100]}...")  # Log the first 100 characters of the extracted text
        # response = await generate_response(text)

        # flashcards = parse_flashcards_json(response)

        # save_flashcards(SessionLocal, flashcards)

        return {"message": "File processed and flashcards saved successfully."}
    
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return {"message": f"An unexpected error occurred: {str(e)}", "status": "error"}
