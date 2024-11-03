# # manager
# from input_generation.question_generator import generate_questions
# topics = ["work environment", "salary", "timings", "play time", "peer pressure"]
# questions = generate_questions(topics)

# # employee
# from input_generation.speech_text_processing import speech_to_text_conversion
# text = "I am very happy with the work environment and the salary is good but the timings are not good and the peer pressure is high but the play time is good."

# # generate feedback text
# from utils.generate_feedback_map import generate_feedback_text
# feedback_text = generate_feedback_text(questions, text)

# # processing
# from output_generation.threshold_generator import process_feedback
# result = process_feedback(questions, feedback_text)
# print(result)

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from input_generation.question_generator import generate_questions
from input_generation.speech_text_processing import speech_to_text_conversion
from utils.generate_feedback_map import generate_feedback_text
from output_generation.threshold_generator import process_feedback

app = FastAPI()

class FeedbackRequest(BaseModel):
    topics: list[str]
    text: str

@app.post("/generate-feedback/")
async def generate_feedback(request: FeedbackRequest):
    try:
        # Generate questions based on topics
        questions = generate_questions(request.topics)

        # Generate feedback text based on the questions
        feedback_text = generate_feedback_text(questions, request.text)

        # Process feedback
        result = process_feedback(questions, feedback_text)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/speech-to-text/")
async def speech_to_text():
    try:
        # Convert speech to text
        text = speech_to_text_conversion()
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))