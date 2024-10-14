# manager
from input_generation.question_generator import generate_questions
topics = ["work environment", "salary", "timings", "play time", "peer pressure"]
questions = generate_questions(topics)

# employee
from input_generation.speech_text_processing import speech_to_text_conversion
text = "I am very happy with the work environment and the salary is good but the timings are not good and the peer pressure is high but the play time is good."

# generate feedback text
from utils.generate_feedback_map import generate_feedback_text
feedback_text = generate_feedback_text(questions, text)

# processing
from output_generation.threshold_generator import process_feedback
result = process_feedback(questions, feedback_text)
print(result)
