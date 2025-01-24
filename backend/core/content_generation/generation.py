from models.groq import GroqModel

class Generation:
    def __init__(self):
        self.model = GroqModel()

    def generate_questions(self, topics):
        """
        Generates feedback questions based on given topics.
        
        Args:
            topics (list): List of topics to generate questions for
            
        Returns:
            list: List of generated questions
        """
        questions = []
        for topic in topics:
            messages = [{
                "role": "user",
                "content": f"Generate a single feedback question which can be asked to a customer/user/employee to give the response on what he/she thinks regarding,{topic} and keep it understandable and simple with lessthan or equal to 12 words."
            }]
            response = self.model.generate_response(messages)
            questions.append(response)
        return questions

    def generate_feedback_map(self, questions, text):
        """
        Generates a mapping of questions to their answers based on provided text.
        
        Args:
            questions (list): List of questions to generate answers for
            text (str): Text content to extract answers from
            
        Returns:
            dict: Dictionary mapping questions to their generated answers
        """
        feedback_text = {}
        for question in questions:
            messages = [{
                "role": "user",
                "content": f"generate answer to this {question} from this {text} and donot use any other words"
            }]
            response = self.model.generate_response(messages)
            feedback_text[question] = response
        return feedback_text