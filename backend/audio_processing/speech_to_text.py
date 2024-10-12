import speech_recognition as sr  # type: ignore

def save_audio(audio_data, filename="../dataset/output_audio.wav"):
    # Saving audio to a .wav file
    with open(filename, "wb") as audio_file:
        audio_file.write(audio_data.get_wav_data())

def speech_to_text_conversion():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening... Speak now.")
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)
        # Save the audio input
        # save_audio(audio)
        
        try:
            text = recognizer.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            return "Sorry, I could not understand the audio."
        except sr.RequestError:
            return "Request to Google API failed."
        
# text = speech_to_text_conversion()
# print(f"Recognized Text: {text}")
