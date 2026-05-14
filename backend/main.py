from fastapi import FastAPI
import json
import os

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

movies_path = os.path.join(BASE_DIR, "movies.json")
music_path = os.path.join(BASE_DIR, "music.json")

with open(movies_path, "r", encoding="utf-8") as f:
    movies = json.load(f)

with open(music_path, "r", encoding="utf-8") as f:
    music_data = json.load(f)


@app.get("/")
def home():
    return {"message": "FastAPI server running"}


@app.get("/status")
def status():
    return {"status": "ok"}


@app.get("/movie/{name}")
def get_movie(name: str):

    movie = movies.get(name)

    if movie:

        return {
            "found": True,
            "name": name,
            "file": movie["file"],
            "last_watched": movie["last_watched"]
        }

    return {
        "found": False,
        "error": "Movie not found"
    }


@app.get("/music/{name}")
def get_music(name: str):

    song = music_data.get(name)

    if song:

        return {
            "found": True,
            "name": name,
            "file": song["file"],
            "artists": song["artists"],
            "thumbnail": song["thumbnail"]
        }

    return {
        "found": False,
        "error": "Music not found"
    }