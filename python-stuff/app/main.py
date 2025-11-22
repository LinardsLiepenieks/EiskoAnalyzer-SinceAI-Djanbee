# app/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path
import shutil
import uuid
import pdfplumber
from typing import List
from pydantic import BaseModel

UPLOAD_DIR = Path("/tmp/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="SinceAI PDF API",
    description="API for uploading and extracting data from PDF documents",
    version="1.0.0"
)

# CORS configuration - allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://localhost:3000",
        "https://*.vercel.app",  # Your Vercel frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Response models
class DeviceRow(BaseModel):
    id: str
    page_number: int
    row_number: int
    symbol: str
    nro: str
    kuvateksti: str
    suoja: str
    kaapeli: str


class ExtractedData(BaseModel):
    filename: str
    total_pages: int
    total_devices: int
    devices: List[DeviceRow]


class UploadResponse(BaseModel):
    status: str
    filename: str
    data: ExtractedData


def extract_pdf_data(path: Path) -> ExtractedData:
    """
    Extract device data from PDF using pdfplumber.
    This is a placeholder that returns dummy structure -
    customize based on your actual PDF format.
    """
    devices: List[DeviceRow] = []

    with pdfplumber.open(path) as pdf:
        total_pages = len(pdf.pages)

        for page_num, page in enumerate(pdf.pages, start=1):
            # Extract tables from the page
            tables = page.extract_tables()

            if tables:
                for table in tables:
                    for row_num, row in enumerate(table, start=1):
                        # Skip header rows or empty rows
                        if not row or len(row) < 4:
                            continue

                        # Map table columns to device fields
                        # Adjust indices based on your actual PDF structure
                        device = DeviceRow(
                            id=f"{page_num}-{row_num}",
                            page_number=page_num,
                            row_number=row_num,
                            symbol=f"/symbols/device.svg",  # Placeholder
                            nro=str(row[0] or "").strip()[:4],
                            kuvateksti=str(row[1] or "").strip(),
                            suoja=str(row[2] or "").strip()[:6],
                            kaapeli=str(row[3] or "").strip()[:14] if len(row) > 3 else "",
                        )
                        devices.append(device)
            else:
                # If no tables found, try to extract text
                text = page.extract_text()
                if text:
                    # Create a placeholder device for pages with text but no tables
                    lines = [l.strip() for l in text.split('\n') if l.strip()]
                    for row_num, line in enumerate(lines[:10], start=1):  # Limit to 10 lines
                        device = DeviceRow(
                            id=f"{page_num}-{row_num}",
                            page_number=page_num,
                            row_number=row_num,
                            symbol=f"/symbols/device.svg",
                            nro=f"{page_num:02d}{row_num:02d}",
                            kuvateksti=line[:64],  # Truncate long lines
                            suoja="",
                            kaapeli="",
                        )
                        devices.append(device)

    return ExtractedData(
        filename=path.name,
        total_pages=total_pages,
        total_devices=len(devices),
        devices=devices
    )


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "service": "SinceAI PDF API"}


@app.get("/health")
async def health():
    """Health check for Render"""
    return {"status": "healthy"}


@app.post("/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF file and extract device data.
    Returns extracted data immediately (synchronous processing).
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Create safe unique filename
    uid = uuid.uuid4().hex
    dest = UPLOAD_DIR / f"{uid}_{file.filename}"

    # Save uploaded file to disk
    try:
        with open(dest, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    finally:
        await file.close()

    # Process PDF and extract data
    try:
        extracted_data = extract_pdf_data(dest)
    except Exception as e:
        # Clean up file on error
        if dest.exists():
            dest.unlink()
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
    finally:
        # Clean up uploaded file after processing
        if dest.exists():
            dest.unlink()

    return UploadResponse(
        status="success",
        filename=file.filename,
        data=extracted_data
    )


@app.post("/upload/async")
async def upload_pdf_async(file: UploadFile = File(...)):
    """
    Upload a PDF file for async processing.
    Returns immediately with a job ID (for future implementation with queue).
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    # Create safe unique filename
    uid = uuid.uuid4().hex
    dest = UPLOAD_DIR / f"{uid}_{file.filename}"

    try:
        with open(dest, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        await file.close()

    # In production, you'd add this to a job queue (Redis, Celery, etc.)
    # For now, just return the job ID
    return JSONResponse({
        "status": "accepted",
        "job_id": uid,
        "filename": file.filename,
        "message": "PDF uploaded. Processing will be done asynchronously."
    }, status_code=202)
