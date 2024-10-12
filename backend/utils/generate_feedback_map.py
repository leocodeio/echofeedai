
from shared.gemini_ai_model import model

def generate_ans_to_question(question, text):
    prompt = f"generate answer to this {question} from this {text} and donot use any other words"
    response = model.generate_content(prompt)
    return response.text

def generate_feedback_text(questions, text):
    feedback_text = {}
    for question in questions:
        feedback_text[question] = generate_ans_to_question(question, text)
        # print(feedback_text[question])
    return feedback_text


