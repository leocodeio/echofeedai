from models.groq import GroqModel
import json
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
            message = [{
                "role": "user",
                "content": f"Generate a single feedback question which can be asked to a customer/user/employee to give the response on what he/she thinks regarding,{topic} and keep it understandable and simple with lessthan or equal to 12 words."
            }]
            # print("debug log 3", message)
            response = self.model.generate_response(message)
            questions.append(response)
        return questions
    
    def generate_feedback_map(self, questions, feedback_text):
        """
        Generates a feedback map based on given questions and feedback text
        
        Args:
            questions (list): List of questions to generate feedback for
            feedback_text (str): Feedback text to be mapped to questions
            
        Returns:
            dict: Feedback map
        """
        feedback_map = {}
        for question in questions:
            EXTRACT_CONTENT_PROMPT = [{   
                "role": "user",
                "content": f'''AGENT: you are a content extractor commanded to extract realated content for a query/question from the given text response data, 
                TASK: Extract the content from the feedback text : "{feedback_text}", for the query about : "{question}", 
                OUTPUT_FORMAT:
                - If the content is not found, output json format with key as "content" and value as "" .
                - If the content is found, output json format with key as "content" and value as the content found.
                DOS: 
                - Extract only the content related to the query/question from the given text response data, 
                - Output the content in the mentioned format, 
                '''
            }]
            feedback_map[question] = json.loads(self.model.generate_response(EXTRACT_CONTENT_PROMPT))['content']
        print("debug log 4", feedback_map)
        return feedback_map