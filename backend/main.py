# main.py
import httpx
import json
from fastapi import FastAPI
from collections import Counter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

DATA_LAST30_URL = "https://maps2.dcgis.dc.gov/dcgis/rest/services/FEEDS/MPD/MapServer/8/query?where=1%3D1&outFields=*&outSR=4326&f=json"
LOCAL_LAST30_FILE = "crime_data_last30.json"


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8000/",  
        "http://127.0.0.1:8000/total-component" 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def fetch_last30_data():
    async with httpx.AsyncClient() as client:
        response = await client.get(DATA_LAST30_URL)
        if response.status_code == 200:
            data = response.json()
            # Save data to a local JSON file
            with open(LOCAL_LAST30_FILE, "w") as file:
                json.dump(data, file)
            return {"message": "Data fetched and stored successfully."}
        else:
            return {"error": "Failed to fetch data", "status_code": response.status_code}

@app.get("/total-component")
def analyze_data():
    with open(LOCAL_LAST30_FILE, "r") as file:
        data = json.load(file)
    
    features = data.get("features", [])
    
    # Calculate total crime count
    total_crimes = len(features)
    
    # Calculate count by offense type
    offense_counter = Counter(feature["attributes"]["OFFENSE"] for feature in features)
    
    return {
        "total_crimes": total_crimes,
        "crime_counts_by_type": offense_counter
    }
