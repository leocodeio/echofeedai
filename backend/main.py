# manager
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








# Backend using fast api
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from input_generation.question_generator import generate_questions
from input_generation.speech_text_processing import speech_to_text_conversion
from utils.generate_feedback_map import generate_feedback_text
from output_generation.threshold_generator import process_feedback

# FastAPI application instance
app = FastAPI()

# Topics for generating questions
topics = ["work environment", "salary", "timings", "play time", "peer pressure"]

# Pydantic model for request payload
class FeedbackRequest(BaseModel):
    text: str

# API endpoint
@app.post("/process-feedback")
async def process_feedback_endpoint(request: FeedbackRequest):
    try:
        # Generate questions
        questions = generate_questions(topics)
        print("Generated Questions:", questions)

        # Get the feedback text directly from the request
        text = request.text
        print("Input Text:", text)

        # Generate feedback text
        feedback_text = generate_feedback_text(questions, text)
        print("Feedback Text:", feedback_text)

        # Process feedback
        result = process_feedback(questions, feedback_text)
        print("Final Result:", result)

        # Return the formatted output
        return result
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing feedback: {str(e)}")

# Run the FastAPI application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
# Run command: uvicorn main:app --reload