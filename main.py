from fastapi import FastAPI, UploadFile, File
from utils.resume_parser import analyze_resume
import tempfile
import shutil

app = FastAPI(title="AI-Powered Resume Analyzer")


@app.post("/analyze/")
async def analyze_resume_endpoint(file: UploadFile = File(...)):
    """Accept PDF file, save temporarily, and analyze it."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name

    # Analyze resume
    result = analyze_resume(temp_file_path)

    return {
        "filename": file.filename,
        "score": result["score"],
        "matched_skills": result["matched_skills"],
        "feedback": result["feedback"]
    }

