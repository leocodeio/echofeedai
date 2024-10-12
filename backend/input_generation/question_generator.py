from shared.gemini_ai_model import model

def generate_questions(topics):
    questions = []
    for topic in topics:
        prompt = f"Generate a single feedback question which can be asked to a customer/user/employee to give the response on what he/she thinks regarding,{topic} and keep it understandable and simple with lessthan or equal to 12 words."
        response = model.generate_content(prompt)
        questions.append(response.text)
    return questions