from fastapi import File, UploadFile, HTTPException
import pdfplumber

async def extract_text(file: UploadFile = File(...)):
    try:
        file_type = check_file_type(file)

        if file_type == "application/pdf":
            text = await extract_text_from_pdf(file)
        elif file_type == "text/plain":
            text = await extract_text_from_plain(file)

        return text

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
    text = ""
    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def extract_text_from_plain(file: UploadFile):
    content = file.file.read()
    return content.decode("utf-8") if isinstance(content, bytes) else content