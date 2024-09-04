import speech_recognition as sr

def record_and_convert():
    # Initialize the recognizer
    recognizer = sr.Recognizer()

    # Use the default microphone as the audio source
    with sr.Microphone() as source:
        print("Listening... Speak now.")
        # Capture the audio from the microphone
        audio = recognizer.listen(source)
        print("HI")
    try:
        # Convert the captured audio to text using Google Web Speech API
        print("Recognizing speech...")
        text = recognizer.recognize_google(audio)
        print("You said:", text)
    except sr.UnknownValueError:
        print("Could not understand the audio.")
    except sr.RequestError as e:
        print(f"Could not request results from the service; {e}")

if __name__ == "__main__":
    record_and_convert()
