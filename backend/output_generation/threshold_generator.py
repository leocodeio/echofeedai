from transformers import pipeline
from textblob import TextBlob

# Step 1: Define sentiment analysis model
sentiment_classification_model = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# Define an aspect extraction model (NER or any advanced aspect extraction model can be used)
aspect_extraction_model = pipeline("ner", model="dslim/bert-base-NER")

# Gemini-based AI Aspect and Threshold Adjuster
def gemini_adjustment(aspects, threshold):
    adjusted_threshold = threshold  # Adjust the threshold based on Gemini AI's logic
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

def extract_aspects_from_question(question):
    # Extracts key terms from the questions themselves as aspects
    # Example: "What do you think about the work environment?" -> aspect: ["work environment"]
    
    # Simplistic keyword-based approach based on common terms
    keywords = ["work environment", "salary", "timings", "play time", "peer pressure"]
    
    # Filter aspects based on keywords found in the question
    aspects = [keyword for keyword in keywords if keyword in question.lower()]
    
    # If no specific aspect is found, return "general" as fallback
    if not aspects:
        aspects = ["general"]
    
    return aspects

def process_feedback(questions, feedback_text):
    feedback_results = {}

    for question in questions:
        feedback = feedback_text.get(question, "")
        
        # Step 1: Extract aspects dynamically from the question
        aspects = extract_aspects_from_question(question)
        
        # Step 2: Analyze sentiment for the feedback text
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
            'feedback': feedback,
            'aspects': adjusted_aspects,
            'threshold': adjusted_threshold,
            'sentiment_score': combined_sentiment_score
        }
    
    return feedback_results

# Example usage
if __name__ == "__main__":
    from input_generation.question_generator import generate_questions
    from utils.generate_feedback_map import generate_feedback_text

    # Generate questions based on topics
    topics = ["work environment", "salary", "timings", "play time", "peer pressure"]
    questions = generate_questions(topics)

    # Employee feedback
    text = "I am very happy with the work environment and the salary is good but the timings are not good and the peer pressure is high but the play time is good."

    # Generate feedback text based on the questions
    feedback_text = generate_feedback_text(questions, text)

    # Process feedback
    result = process_feedback(questions, feedback_text)

    # Output results
    for question, res in result.items():
        print(f"Question: {question}")
        print(f"Feedback: {res['feedback']}")
        print(f"Aspects: {res['aspects']}")
        print(f"Threshold: {res['threshold']}")
        print(f"Sentiment Score: {res['sentiment_score']:.2f}\n")