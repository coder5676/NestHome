import threading

# 🔔 wake word signal
wake_event = threading.Event()

# 🧠 latest recognized speech
latest_command = ""

# optional flags
is_listening = False
assistant_active = False