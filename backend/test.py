import speech_recognition as sr # type: ignore

def record_and_convert():
    # Initialize the recognizer
    recognizer = sr.Recognizer()

    # audio from mic

    # with sr.Microphone() as source:
    #     print("Listening... Speak now.")
    #     # Capture the audio from the microphone
    #     recognizer.adjust_for_ambient_noise(source)
    #     audio = recognizer.listen(source)
    #     print("HI")

    # audio file to do the analysis

    audio_file = 'C:\\Users\\saiha\\OneDrive\\Desktop\\leocodeio\\echofeedai\\backend\dataset\\OSR_us_000_0010_8k.wav'
    with sr.AudioFile(audio_file) as source:
        print("Loading audio file...")
        audio = recognizer.record(source)

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