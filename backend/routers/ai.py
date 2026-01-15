from fastapi import APIRouter, Depends, HTTPException
import google.generativeai as genai
from dotenv import load_dotenv
import os

from auth import get_current_user
from schemas import AIQuestion

load_dotenv()

router = APIRouter(prefix="/ai", tags=["AI"])

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

#  Use EXACT model name from list_models()
model = genai.GenerativeModel("models/gemini-flash-latest")


@router.post("/ask")
def ask_ai(
    payload: AIQuestion,
    user: str = Depends(get_current_user)
):
    try:
        response = model.generate_content(payload.question)

        return {
            "question": payload.question,
            "answer": response.text
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}"
        )


