import os
from dotenv import load_dotenv
load_dotenv()
import google.generativeai as genai

genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

def generate_questions(topics):
    questions = []
    for topic in topics:
        prompt = f"Generate a single feedback question which can be asked to a customer/user/employee to give the response on what he/she thinks regarding,{topic} and keep it understandable and simple with lessthan or equal to 12 words."
        response = model.generate_content(prompt)
        questions.append(response.text)
    return questions

topics = ["work environment", "salary", "timings","play time","peer pressure"]
questions = generate_questions(topics)
[print(x) for x in questions]