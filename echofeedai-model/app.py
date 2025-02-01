from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from core.content_generation.generation import Generation
from core.content_processing.process_feedback import FeedbackProcessor
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI(
    title="EchoFeed AI API",
    description="API for employee feedback analysis and question generation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None
)

# Create a 'static' directory if it doesn't exist
os.makedirs("static", exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Favicon endpoint
@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return FileResponse('static/favicon.ico')

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TopicRequest(BaseModel):
    topics: List[str]
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "topics": ["work environment", "salary structure", "team collaboration"]
            }
        }
    }

class FeedbackRequest(BaseModel):
    question_map: Dict[str, str]
    employee_text: str
    min_threshold: int = 3
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "question_map": {
                    "work environment": "How would you rate the current work environment?",
                    "salary structure": "What are your thoughts on the current salary structure?",
                    "team collaboration": "How effective is the team collaboration in your department?"
                },
                "employee_text": "The work environment is great but salary could be better.",
                "min_threshold": 3
            }
        }
    }

class CoverageResult(BaseModel):
    topic: str
    covered: bool
    matching_question: str
    matching_answer: str

# Hello World
@app.get("/")
async def hello_world():
    return {"message": "Hello World"}

# Generate Questions
@app.post("/generate-questions/", 
         summary="Generate Feedback Questions",
         description="Generates specific questions for given topics and maps them",
         response_description="Mapped questions with topics")
async def generate_questions(request: TopicRequest):
    """Generate survey questions for given topics and create a mapping
    
    Args:
        topics (List[str]): List of topics to generate questions for
        
    Returns:
        Dict[str, str]: Mapping of topics to their corresponding questions
    """
    try:
        print("debug log 0", request.topics)
        generator = Generation()
        questions = generator.generate_questions(list(request.topics))
        print("debug log 1", questions)
        # Create topic to question mapping
        question_map = {}
        for topic, question in zip(request.topics, questions):
            question_map[topic] = question
            
        return {"question_map": question_map}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Process Feedback
@app.post("/process-feedback/",
         summary="Process Employee Feedback",
         description="Analyzes feedback text and checks topic coverage",
         response_description="Analysis results with coverage check")
async def process_feedback(request: FeedbackRequest):
    """Process employee feedback and validate topic coverage
    
    Args:
        question_map (Dict[str, str]): Mapping of topics to their questions
        employee_text (str): Employee feedback text
        min_threshold (int): Minimum acceptable sentiment threshold
        
    Returns:
        Dict: Analysis results and coverage status
    """
    try:
        generator = Generation()
        processor = FeedbackProcessor()
        
        # Create feedback mapping using the provided questions
        feedback_map = generator.generate_feedback_map(list(request.question_map.values()), request.employee_text)
        
        # Process feedback results
        analysis_results = processor.process_feedback(list(request.question_map.values()), feedback_map)
        
        # Check topic coverage
        coverage_results = []
        covered = []
        not_covered = []
        for topic, question in request.question_map.items():
            # Check if topic exists in any question/answer
            if analysis_results['data'][question]['covered']:
                covered.append({
                    "topic": topic,
                    "question": question,
                    "feedback": analysis_results['data'][question]['feedback']
                })
            else:
                not_covered.append({
                    "topic": topic,
                    "question": question,
                    "feedback": analysis_results['data'][question]['feedback']
                })

        if len(not_covered) == 0:
            all_covered = True
        else:
            all_covered = False

        return {
            "all_topics_covered": all_covered,
            "covered": covered,
            "not_covered": not_covered
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)