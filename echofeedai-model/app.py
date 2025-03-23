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

class CoverageRequest(BaseModel):
    question_map: Dict[str, str]
    employee_text: str
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "question_map": {
                    "work environment": "How would you rate the current work environment?",
                    "salary structure": "What are your thoughts on the current salary structure?",
                    "team collaboration": "How effective is the team collaboration in your department?"
                },
                "employee_text": "The work environment is great but salary could be better."
            }
        }
    }

# Hello World
@app.get("/")
async def hello_world():
    return {"message": "Hello World"}

# Generate Questions
@app.post("/generate-questions", 
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
        print("-----------debug log 0------------\n", request.topics)
        generator = Generation()
        questions = generator.generate_questions(list(request.topics))
        print("-----------debug log 1------------\n", questions)
        # Create topic to question mapping
        question_map = {}
        for topic, question in zip(request.topics, questions):
            question_map[topic] = question
            
        return {"question_map": question_map}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Process Feedback
@app.post("/process-feedback",
         summary="Process Employee Feedback",
         description="Analyzes feedback text and checks topic coverage",
         response_description="Analysis results with coverage check")
async def process_feedback(request: CoverageRequest):
    """Process employee feedback and validate topic coverage
    
    Args:
        question_map (Dict[str, str]): Mapping of topics to their questions
        employee_text (str): Employee feedback text
        
    Returns:
        Dict: Analysis results and coverage status
    """
    try:
        print("app.py line: 115\n-----------debug log 0------------\n", request)
        generator = Generation()
        processor = FeedbackProcessor()
        
        # Create feedback mapping using the provided questions
        feedback_map = generator.generate_feedback_map(list(request.question_map.values()), request.employee_text)
        print("app.py line: 118\n-----------debug log 1------------\n", feedback_map)
        # Process feedback results
        analysis_results = processor.process_feedback(list(request.question_map.values()), feedback_map)
        print("app.py line: 120\n-----------debug log 2------------\n", analysis_results)
        # Check topic coverage
        covered = []
        not_covered = []
        for topic, question in request.question_map.items():
            # Check if topic exists in any question/answer
            print("app.py line: 122\n-----------debug log 3------------\n", analysis_results['data'][question])
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
        print("app.py line: 124\n-----------debug log 4------------\n", covered)
        print("app.py line: 125\n-----------debug log 5------------\n", not_covered)
        if len(not_covered) == 0:
            all_covered = True
        else:
            all_covered = False
        print("app.py line: 127\n-----------debug log 6------------\n", all_covered)
        return {
            "all_topics_covered": all_covered,
            "covered": covered,
            "not_covered": not_covered
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get Responses
@app.post("/get-score-map",
         summary="Get Score Map",   
         description="Get score map for a given feedback")
async def get_score_map(request: CoverageRequest):
    """Get score map for responses and questions"""
    try:
        generator = Generation()
        processor = FeedbackProcessor()
        
        # Add error handling for empty inputs
        if not request.question_map or not request.employee_text:
            raise HTTPException(
                status_code=400, 
                detail="Question map and employee text are required"
            )
        
        # Create feedback mapping using the provided questions
        feedback_map = generator.generate_feedback_map(
            list(request.question_map.values()), 
            request.employee_text
        )
        
        # Add validation for feedback map
        if not feedback_map:
            raise HTTPException(
                status_code=500,
                detail="Failed to generate feedback map"
            )
        
        # Process feedback results
        analysis_results = processor.process_feedback(
            list(request.question_map.values()), 
            feedback_map
        )
        
        # Validate analysis results
        if not analysis_results or analysis_results.get("status") == "error":
            raise HTTPException(
                status_code=500,
                detail=analysis_results.get("message", "Failed to process feedback")
            )
        
        # Create score map with validation
        score_map = {}
        for topic, question in request.question_map.items():
            if question in analysis_results['data']:
                score_map[topic] = analysis_results['data'][question]['threshold']
            else:
                score_map[topic] = 0  # Default score for missing data
        print("app.py line: 149\n-----------debug log 1------------\n", score_map)
        return {"score_map": score_map}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)