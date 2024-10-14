from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Allow CORS for the Next.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define data model
class Document(BaseModel):
    type: str
    title: str
    position: int

# In-memory storage (replace with a database in production)
documents = [
    {"type": "bank-draft", "title": "Bank Draft", "position": 0},
    {"type": "bill-of-lading", "title": "Bill of Lading", "position": 1},
    {"type": "invoice", "title": "Invoice", "position": 2},
    {"type": "bank-draft-2", "title": "Bank Draft 2", "position": 3},
    {"type": "bill-of-lading-2", "title": "Bill of Lading 2", "position": 4},
]

@app.get("/documents", response_model=List[Document])
async def get_documents():
    return documents

@app.put("/documents", response_model=dict)
async def update_documents(updated_docs: List[Document]):
    global documents
    
    # Ensure the incoming data is valid
    if not updated_docs:
        raise HTTPException(status_code=400, detail="No documents provided for update.")
    
    # Update the in-memory storage with the new documents
    documents = [doc.dict() for doc in updated_docs]  # Ensure that they are stored as dicts
    return {"message": "Documents updated successfully"}

@app.post("/documents", response_model=dict)
async def save_documents(new_docs: List[Document]):
    global documents
    
    # Append new documents to the existing list, while ensuring uniqueness
    for new_doc in new_docs:
        if new_doc.type not in [doc['type'] for doc in documents]:
            documents.append(new_doc.dict())
    
    return {"message": "Documents saved successfully", "documents": documents}
