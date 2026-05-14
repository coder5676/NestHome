import speech_recognition as sr
import state

r = sr.Recognizer()

while True:

    # 🔥 WAIT (NO CPU USAGE)
    state.wake_event.wait()

    try:
        with sr.Microphone() as source:

            print("Listening...")
            r.adjust_for_ambient_noise(source)

            audio = r.listen(source, timeout=5, phrase_time_limit=5)

        text = r.recognize_google(audio)

        print("You said:", text)

        state.latest_command = text

    except Exception as e:
        print("Error:", e)

    # reset event after processing
    state.wake_event.clear()