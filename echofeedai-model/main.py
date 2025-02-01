from core.content_generation.generation import Generation
from core.content_processing.process_feedback import FeedbackProcessor

def main():
    # Initialize the models
    generator = Generation()
    processor = FeedbackProcessor()
    
    # Sample input data (matching the API structure)
    topics = ["work environment", "salary structure", "team collaboration"]
    
    print("\n=== Generating Questions ===")
    # Generate questions using the Generation class
    questions = generator.generate_questions(topics)
    
    # Create topic to question mapping (similar to API)
    question_map = {}
    for topic, question in zip(topics, questions):
        question_map[topic] = question
        print(f"Topic: {topic}")
        print(f"Question: {question}\n")
    
    # Sample employee feedback text
    employee_text = "The work environment is great but salary could be better. The team collaboration needs improvement."
    print("=== Processing Feedback ===")
    print(f"Employee Text: {employee_text}\n")
    
    # Generate feedback map using the Generation class
    feedback_map = generator.generate_feedback_map(list(question_map.values()), employee_text)
    
    # Process feedback results (similar to API implementation)
    analysis_results = processor.process_feedback(list(question_map.values()), feedback_map)
    
    # Check topic coverage (similar to API implementation)
    coverage_results = []
    all_covered = True
    
    print("=== Analysis Results ===")
    for topic, question in question_map.items():
        covered = False
        match_answer = ""
        
        if question in feedback_map:
            covered = True
            match_answer = feedback_map[question]
            
        coverage_results.append({
            "topic": topic,
            "covered": covered,
            "matching_question": question,
            "matching_answer": match_answer
        })
        
        if not covered:
            all_covered = False
            
        print(f"\nTopic: {topic}")
        print(f"Covered: {covered}")
        print(f"Question: {question}")
        print(f"Answer: {match_answer if match_answer else 'No response'}")

    print("\n=== Coverage Summary ===")
    print(f"All Topics Covered: {all_covered}")
    print("\n=== Analysis Details ===")
    print(analysis_results)

if __name__ == "__main__":
    main()