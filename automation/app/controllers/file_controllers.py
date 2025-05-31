from fastapi import File, UploadFile, HTTPException

async def handle_file_upload(file: UploadFile = File(...)):
    try:
        check_file_type(file)

        #AI model processing 
        
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