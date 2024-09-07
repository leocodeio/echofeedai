def generate_bullet_summary(feedback_text, requirements):
    summary = []
    
    for req in requirements:
        if req in feedback_text:
            summary.append(f"Feedback covers: {req}")
        else:
            summary.append(f"Missing: {req}")

    return summary
