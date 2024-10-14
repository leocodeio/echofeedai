from transformers import pipeline
from textblob import TextBlob

# Step 1: Define aspect extraction model (replace NER with a true aspect extraction model)
sentiment_classification_model = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# If you have a custom ATE model fine-tuned for Aspect Term Extraction, load it here:
aspect_extraction_model = pipeline("ner", model="dslim/bert-base-NER")  # Replace with appropriate ATE model

# Gemini-based AI Aspect and Threshold Adjuster
def gemini_adjustment(aspects, threshold):
    """
    Simulates a Gemini AI model that adjusts the aspect terms and thresholds.
    Here, you would integrate with the actual Gemini API or model.
    """
    adjusted_threshold = threshold  # Adjust the threshold based on Gemini AI's logic
    # If Gemini modifies aspects, adjust here
    return aspects, adjusted_threshold

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
    
    # Print the raw output of the aspect extraction model to inspect the entities
    print("Aspect Extraction Model Output:", aspects)

    # Modify the entity if needed based on the ATE model's output
    # Check for appropriate entity types (e.g., 'B-MISC', 'B-ORG', etc.)
    aspect_terms = [aspect['word'] for aspect in aspects if 'ORG' in aspect['entity']]  # Adjust 'ORG' to relevant entity
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
        model_sentiment_score = 0.25 if sentiment_label == "POSITIVE" else -0.25

        # Step 3: Calculate sentiment score using TextBlob
        textblob_sentiment_score = TextBlob(feedback).sentiment.polarity

        # Step 4: Combine scores and assign a threshold
        combined_sentiment_score = textblob_sentiment_score + model_sentiment_score
        threshold = assign_threshold(combined_sentiment_score)

        # Step 5: Apply AI-based adjustments using Gemini model
        adjusted_aspects, adjusted_threshold = gemini_adjustment(aspects, threshold)

        # Step 6: Store results, including aspects and thresholds
        feedback_results[question] = {
            'aspects': adjusted_aspects,
            'threshold': adjusted_threshold
        }
    
    return feedback_results
