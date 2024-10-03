import speech_recognition as sr # type: ignore

def source_to_text(audio_file):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        print("Loading audio file...")
        audio = recognizer.record(source)

    try:
        print("Recognizing speech...")
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        print("Could not understand the audio.")
    except sr.RequestError as e:
        print(f"Could not request results from the service; {e}")


text = source_to_text('../dataset/OSR_us_000_0010_8k.wav')
print(text)
