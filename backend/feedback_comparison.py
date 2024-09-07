from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
from nltk import download
from collections import Counter

download('punkt')
download('stopwords')

def compare_feedback(feedback_text, requirements):
    # print(feedback_text)
    # print(requirements)
    feedback_sentences = sent_tokenize(feedback_text)
    
    covered_points = []
    missing_points = []

    for req in requirements:
        if any(req in sentence for sentence in feedback_sentences):
            covered_points.append(req)
        else:
            missing_points.append(req)
    # print(covered_points)
    # print(missing_points)
    is_covered = len(missing_points) == 0
    return is_covered, missing_points
