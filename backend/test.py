from textblob import TextBlob

def assign_threshold(score):
    """Assign a threshold based on a sentiment score."""
    if score < -0.3:
        return "Poor"
    elif -0.3 <= score < 0:
        return "Average"
    elif 0 <= score < 0.3:
        return "Good"
    elif 0.3 <= score < 0.6:
        return "Very Good"
    else:
        return "Excellent"

def process_feedback(questions, feedback_text):
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

# Example usage:
questions = [
    "How would you rate the service?",
    "Was the product quality up to your expectations?",
    "How was the support experience?"
]

feedback_text = {
    "How would you rate the service?": "The service was slow and not satisfactory.",
    "Was the product quality up to your expectations?": "The product was good but had minor issues.",
    "How was the support experience?": "The support was fantastic and very responsive!"
}

result = process_feedback(questions, feedback_text)
print(result)
