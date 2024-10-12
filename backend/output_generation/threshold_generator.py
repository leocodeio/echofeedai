from transformers import pipeline
from textblob import TextBlob
sentiment_classification_model = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")


def assign_threshold(sentiment_score):
    if sentiment_score <= 0.2:
        return 1  # poor
    elif sentiment_score <= 0.4:
        return 2  # average
    elif sentiment_score <= 0.6:
        return 3  # good
    elif sentiment_score <= 0.8:
        return 4  # great
    else:
        return 5  # excellent
    
def process_blob_feedback(questions, feedback_text):
    """
    Process feedback text and assign a threshold to each question.
    
    Parameters:
    - questions: A list of feedback questions.
    - feedback_text: A dictionary with question keys and feedback text values.
    
    Returns:
    - A dictionary with questions and their respective thresholds.
    """
    feedback_thresholds = {}
    
    for question in questions:
        text = feedback_text.get(question, "")
        sentiment_score = TextBlob(text).sentiment.polarity
        threshold = assign_threshold(sentiment_score)
        feedback_thresholds[question] = threshold
    
    return feedback_thresholds

    
def process_feedback(questions, feedback_text):
    """
    Process feedback text and assign a threshold to each question using Transformer models.
    
    Parameters:
    - questions: A list of feedback questions.
    - feedback_text: A dictionary with question keys and feedback text values.
    
    Returns:
    - A dictionary with questions and their respective thresholds.
    """
    feedback_thresholds = {}
    
    for question in questions:


        feedback = feedback_text.get(question, "")
        # Step 2: Classify the sentiment
        sentiment_results = sentiment_classification_model(feedback)
        
        # Get the sentiment label and score
        sentiment_label = sentiment_results[0]['label']
        if sentiment_label == "POSITIVE":
            model_sentiment_score = 0.25
        elif sentiment_label == "NEGATIVE":
            model_sentiment_score = -0.25
        else:
            model_sentiment_score = 0

        textblob_sentiment_score = TextBlob(feedback).sentiment.polarity

        threshold = assign_threshold(textblob_sentiment_score + model_sentiment_score)
        
        feedback_thresholds[question] = threshold
    
    return feedback_thresholds