from transformers import pipeline
from textblob import TextBlob

# Step 1: Define aspect extraction model (e.g., using a pre-trained named entity recognizer or custom model)
sentiment_classification_model = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
aspect_extraction_model = pipeline("ner", model="distilbert-base-uncased-finetuned-sst-2-english")

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

def extract_aspects(feedback_text):
    """
    Extract aspects from feedback text using aspect extraction model.
    
    Parameters:
    - feedback_text: A string containing feedback.
    
    Returns:
    - A list of aspect terms extracted from the feedback text.
    """
    aspects = aspect_extraction_model(feedback_text)
    aspect_terms = [aspect['word'] for aspect in aspects if aspect['entity'] == 'MISC']  # Adjust based on the ATE model
    return aspect_terms

def process_feedback(questions, feedback_text):
    """
    Process feedback text and assign a threshold to each question using Transformer models.
    
    Parameters:
    - questions: A list of feedback questions.
    - feedback_text: A dictionary with question keys and feedback text values.
    
    Returns:
    - A dictionary with questions, their respective aspect terms, and thresholds.
    """
    feedback_results = {}

    for question in questions:
        feedback = feedback_text.get(question, "")
        
        # Step 1: Extract aspects
        aspects = extract_aspects(feedback)
        
        # Step 2: Analyze sentiment for the entire feedback text
        sentiment_results = sentiment_classification_model(feedback)
        
        # Get the sentiment label and score
        sentiment_label = sentiment_results[0]['label']
        if sentiment_label == "POSITIVE":
            model_sentiment_score = 0.25
        elif sentiment_label == "NEGATIVE":
            model_sentiment_score = -0.25
        else:
            model_sentiment_score = 0

        # Step 3: Calculate sentiment score using TextBlob
        textblob_sentiment_score = TextBlob(feedback).sentiment.polarity

        # Step 4: Combine scores and assign a threshold
        combined_sentiment_score = textblob_sentiment_score + model_sentiment_score
        threshold = assign_threshold(combined_sentiment_score)

        # Step 5: Store results, including aspects
        feedback_results[question] = {
            'aspects': aspects,
            'threshold': threshold
        }
    
    return feedback_results
