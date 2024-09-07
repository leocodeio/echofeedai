from flask import Flask, render_template, request, redirect, url_for
from audio_processing.speech_to_text import convert_audio_to_text
from feedback_comparison import compare_feedback
from bullet_summary import generate_bullet_summary

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return redirect(url_for('index'))

    audio_file = request.files['file']
    
    # Step 1: Convert audio to text
    user_feedback = convert_audio_to_text(audio_file)
    
    # Step 2: Load manager's requirements
    with open('manager_requirements.txt', 'r') as f:
        manager_requirements = f.read().splitlines()

    # Step 3: Compare feedback with requirements
    is_covered, missing_points = compare_feedback(user_feedback, manager_requirements)

    if is_covered:
        summary = generate_bullet_summary(user_feedback, manager_requirements)
        return render_template('result.html', summary=summary)
    else:
        return render_template('index.html', missing_points=missing_points)

if __name__ == '__main__':
    app.run(debug=True)
