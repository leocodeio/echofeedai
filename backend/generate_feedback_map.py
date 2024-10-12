import os
from dotenv import load_dotenv
load_dotenv()
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

def generate_ans_to_question(question, text):
    prompt = f"generate answer to this {question} from this {text} and donot use any other words"
    response = model.generate_content(prompt)
    return response.text

def generate_feedback_text(questions, text):
    feedback_text = {}
    for question in questions:
        feedback_text[question] = generate_ans_to_question(question, text)
        print(feedback_text[question])
        # feedback_text[question] = text
    return feedback_text


