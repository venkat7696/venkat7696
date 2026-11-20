import os
from datetime import datetime, timezone

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo import MongoClient

load_dotenv()

app = FastAPI(title="ECE HUB API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
mongodb_url = os.getenv("MONGODB_URL")
database_name = os.getenv("DATABASE_NAME", "ece_hub_db")

if not mongodb_url:
    raise RuntimeError("MONGODB_URL missing in .env")

client = MongoClient(
    mongodb_url,
    serverSelectionTimeoutMS=10000
)

client.admin.command("ping")
db = client[database_name]

projects_collection = db["projects"]

print("MongoDB connected successfully!")


# Project data model
class Project(BaseModel):
    title: str = Field(min_length=1)
    category: str = Field(min_length=1)
    price: float = Field(ge=0)
    image: str = ""
    description: str = ""
    technology: str = ""


# Home API
@app.get("/")
def home():
    return {
        "message": "Welcome to ECE HUB Backend",
        "status": "Running"
    }


# Health API
@app.get("/health")
def health():
    return {"status": "healthy"}


# Database test
@app.get("/db-test")
def database_test():
    result = db.test.insert_one({
        "message": "ECE HUB database connected",
        "created_at": datetime.now(timezone.utc)
    })

    return {
        "message": "MongoDB read/write test successful",
        "inserted_id": str(result.inserted_id)
    }


# GET all projects
@app.get("/projects")
def get_projects():
    projects = list(projects_collection.find())

    for project in projects:
        project["id"] = str(project.pop("_id"))

    return projects


# ADD new project
@app.post("/projects", status_code=201)
def add_project(project: Project):
    project_data = project.model_dump()

    project_data["created_at"] = datetime.now(timezone.utc)

    result = projects_collection.insert_one(project_data)

    return {
        "message": "Project added successfully",
        "id": str(result.inserted_id)
    }


# UPDATE project
@app.put("/projects/{project_id}")
def update_project(project_id: str, project: Project):

    if not ObjectId.is_valid(project_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid project ID"
        )

    result = projects_collection.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": project.model_dump()}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return {"message": "Project updated successfully"}


# DELETE project
@app.delete("/projects/{project_id}")
def delete_project(project_id: str):

    if not ObjectId.is_valid(project_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid project ID"
        )

    result = projects_collection.delete_one(
        {"_id": ObjectId(project_id)}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return {"message": "Project deleted successfully"}