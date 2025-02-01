from transformers import pipeline
from textblob import TextBlob

class FeedbackProcessor:
    def __init__(self):
        """Initialize the FeedbackProcessor with required models"""
        self.sentiment_model = pipeline(
            "sentiment-analysis", 
            model="distilbert-base-uncased-finetuned-sst-2-english"
        )
        self.aspect_model = pipeline(
            "ner", 
            model="dslim/bert-base-NER"
        )

    def _assign_threshold(self, sentiment_score):
        """
        Assign threshold based on sentiment score
        
        Args:
            sentiment_score (float): Combined sentiment score
            
        Returns:
            int: Threshold value (1-5)
        """
        if sentiment_score <= 0.2:
            return 1  # poor
        elif sentiment_score <= 0.4:
            return 2  # average
        elif sentiment_score <= 0.6:
            return 3  # good
        elif sentiment_score <= 0.8:
            return 4  # great
        return 5  # excellent

    def _extract_aspects(self, question):
        """
        Extract key aspects from the question
        
        Args:
            question (str): Input question
            
        Returns:
            list: Extracted aspects
        """
        # use aspect model to extract aspects
        aspects = self.aspect_model(question)
        return aspects

    def _analyze_sentiment(self, text):
        """
        Analyze sentiment using multiple models
        
        Args:
            text (str): Input text for sentiment analysis
            
        Returns:
            float: Combined sentiment score
        """
        model_result = self.sentiment_model(text)
        model_score = 0.25 if model_result[0]['label'] == "POSITIVE" else -0.25
        
        textblob_score = TextBlob(text).sentiment.polarity
        return textblob_score + model_score

    def process_feedback(self, questions, feedback_map):
        """
        Process feedback with sentiment analysis and aspect extraction
        
        Args:
            questions (list): List of questions to process
            feedback_text (dict): Dictionary mapping questions to their feedback
            
        Returns:
            dict: Processed feedback results
        """
        try:
            feedback_results = {}

            for question in questions:
                feedback = feedback_map.get(question, "")
                
                # Extract aspects and analyze sentiment
                aspects = self._extract_aspects(question)
                sentiment_score = self._analyze_sentiment(feedback)
                threshold = self._assign_threshold(sentiment_score)
                covered = True if feedback != "" else False
                print("debug log 1", feedback)
                # Store results
                feedback_results[question] = {
                    'covered': covered,
                    'aspects': aspects,
                    'feedback': feedback,
                    'threshold': threshold,
                    'sentiment_score': sentiment_score
                }
            
            return {
                "status": "success",
                "data": feedback_results
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": f"Error processing feedback: {str(e)}"
            }

# Example usage
if __name__ == "__main__":
    processor = FeedbackProcessor()
    
    sample_questions = [
        "How do you feel about the work environment?",
        "What are your thoughts on the salary?"
    ]
    
    sample_feedback = {
        "How do you feel about the work environment?": "The work environment is very positive and collaborative.",
        "What are your thoughts on the salary?": "The salary is competitive but could be better."
    }
    
    result = processor.process_feedback(sample_questions, sample_feedback)
    print(result)
