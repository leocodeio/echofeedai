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
        Generates a feedback map based on given questions and feedback text.

        Args:
            questions (list): List of questions to generate feedback for.
            feedback_text (str): Feedback text to be mapped to questions.

        Returns:
            dict: Feedback map with questions as keys and extracted content as values.
        """
        feedback_map = {}

        for question in questions:
            print("generation.py line: 41-----------debug log 0------------ \n", question)

            # Define the prompt for content extraction
            EXTRACT_CONTENT_PROMPT = [{
                "role": "user",
                "content": f'''
                AGENT: you are a content extractor commanded to extract related content for a query/question from the given text response data.
                TASK: Extract the content from the feedback text: "{feedback_text}", for the query about: "{question}".
                OUTPUT_FORMAT:
                - Output only the content found in the text response data.
                - If the content is found, return: <content found>.
                - If no relevant content is found, return: Empty
                DOS:
                - Extract only the content related to the query/question from the given text response data.
                - Do not include any additional text.
                '''
            }]

            # Generate response from the model
            model_response = self.model.generate_response(EXTRACT_CONTENT_PROMPT)
            print("generation.py line: 54-----------debug log 1------------ \n", model_response)

            # Store the response in the feedback map
            feedback_map[question] = model_response if model_response != "Empty" else ""

        print("generation.py line: 55-----------debug log 2------------ \n", feedback_map)
        return feedback_map
