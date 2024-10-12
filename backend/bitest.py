from transformers import pipeline

# Using a general-purpose model for feature extraction and a sentiment analysis model

sentiment_classification_model = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# ... existing code ...

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
        text = feedback_text.get(question, "")
        
        # Step 2: Classify the sentiment
        sentiment_results = sentiment_classification_model(text)
        
        # Get the sentiment label and score
        sentiment_label = sentiment_results[0]['label']
        confidence_score = sentiment_results[0]['score']
        
        # Convert POSITIVE/NEGATIVE to a score between 0 and 1
        sentiment_score = confidence_score if sentiment_label == "POSITIVE" else 1 - confidence_score
        
        # print(f"Question: {question}")
        # print(f"Feedback: {text}")
        # print(f"Sentiment: {sentiment_label}, Score: {sentiment_score}")
        
        # Assign a threshold based on the sentiment score
        threshold = assign_threshold(sentiment_score)
        
        feedback_thresholds[question] = threshold
        print(f"Assigned threshold: {threshold}\n")
    
    return feedback_thresholds


# # Example usage:
# questions = [
#     "How would you rate the service?",
#     "Was the product quality up to your expectations?",
#     "How was the support experience?"
# ]

# feedback_text = {
#     "How would you rate the service?": "The service was slow and not satisfactory.",
#     "Was the product quality up to your expectations?": "The product was good but had minor issues.",
#     "How was the support experience?": "The support was fantastic and very responsive!"
# }

# result = process_feedback(questions, feedback_text)
# print(result)
