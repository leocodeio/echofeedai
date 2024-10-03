import speech_recognition as sr # type: ignore

def speech_to_text():
    with sr.Microphone() as source:
        recognizer = sr.Recognizer()
        print("Listening... Speak now.")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
        text = recognizer.recognize_google(audio)
        return text
text=speech_to_text()
print(text)