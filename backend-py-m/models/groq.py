from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class GroqModel:
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "mixtral-8x7b-32768"

    def generate_response(self, messages):
        try:
            chat_completion = self.client.chat.completions.create(
                messages=messages,
                model=self.model,
                temperature=0.7,
                max_tokens=1024,
            )
            
            return chat_completion.choices[0].message.content
        
        except Exception as e:
            print(f"Error generating response: {str(e)}")
            return "Sorry, I encountered an error while processing your request."

    def set_model(self, model_name):
        """
        Change the model being used
        """
        self.model = model_name
