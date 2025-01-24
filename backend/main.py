from core.content_generation.generation import Generation
from core.output_generation.threshold_generator import process_feedback

def main():
    # Initialize the generation model
    generator = Generation()
    
    # Define topics
    topics = ["work environment", "salary", "timings", "play time", "peer pressure"]
    
    # Generate questions using the Generation class
    questions = generator.generate_questions(topics)
    
    # Sample employee feedback text (in production, this would come from speech-to-text)
    text = "I am very happy with the work environment and the salary is good but the timings are not good and the peer pressure is high but the play time is good."
    
    # Generate feedback map using the Generation class
    feedback_text = generator.generate_feedback_map(questions, text)
    
    # Process feedback and generate results
    result = process_feedback(questions, feedback_text)
    
    # Print results
    for question, res in result.items():
        print(f"\nQuestion: {question}")
        print(f"Feedback: {res['feedback']}")
        print(f"Aspects: {res['aspects']}")
        print(f"Threshold: {res['threshold']}")
        print(f"Sentiment Score: {res['sentiment_score']:.2f}")

if __name__ == "__main__":
    main()