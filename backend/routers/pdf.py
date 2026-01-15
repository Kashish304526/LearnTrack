from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
import google.generativeai as genai
from dotenv import load_dotenv
import os
from pypdf import PdfReader

from auth import get_current_user

load_dotenv()

router = APIRouter(prefix="/pdf", tags=["PDF"])

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY not set")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("models/gemini-flash-latest")

@router.post("/summarize")
async def summarize_pdf(
    file: UploadFile = File(...),
    user: str = Depends(get_current_user)
):
    try:
        if file.content_type != "application/pdf":
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are supported"
            )

        reader = PdfReader(file.file)
        text = ""

        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"

        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="No readable text found in PDF"
            )

        response = model.generate_content(
            f"Summarize the following study material clearly:\n{text}"
        )

        return {
            "summary": response.text
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF summarization failed: {str(e)}"
        )
