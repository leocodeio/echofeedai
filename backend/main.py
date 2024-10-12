
# manager
from input_generator.question_generator import generate_questions
topics = ["work environment", "salary", "timings","play time","peer pressure"]
questions = generate_questions(topics)
# manger might edit the questions

# emplyee
from audio_processing.speech_to_text import speech_to_text_conversion
# text = speech_to_text()
text = "I am very happy with the work environment and the salary is good but the timings are not good and the peer pressure is high but the play time is good."

# generate feedback text
from generate_feedback_map import generate_feedback_text
feedback_text = generate_feedback_text(questions, text)

# processing
from bitest import process_feedback
result = process_feedback(questions, feedback_text)
print(result)
