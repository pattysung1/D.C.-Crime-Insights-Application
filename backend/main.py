import httpx
import json
from fastapi import FastAPI
from collections import Counter
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

DATA_LAST30_URL = "https://maps2.dcgis.dc.gov/dcgis/rest/services/FEEDS/MPD/MapServer/8/query?where=1%3D1&outFields=*&outSR=4326&f=json"
LOCAL_LAST30_FILE = "crime_data_last30.json"

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# List of crime CSV files and their respective years
csv_files = {
    "2019": "./Crime_Incidents/Crime_Incidents_in_2019.csv",
    "2020": "./Crime_Incidents/Crime_Incidents_in_2020.csv",
    "2021": "./Crime_Incidents/Crime_Incidents_in_2021.csv",
    "2022": "./Crime_Incidents/Crime_Incidents_in_2022.csv",
    "2023": "./Crime_Incidents/Crime_Incidents_in_2023.csv",
    "2024": "./Crime_Incidents/Crime_Incidents_in_2024.csv"
}

# Mapping for offense types to broader categories
crime_category_mapping = {
    "THEFT/OTHER": "theft",
    "THEFT F/AUTO": "theft",
    "ASSAULT W/DANGEROUS WEAPON": "assault",
    "SIMPLE ASSAULT": "assault",
    "VANDALISM": "vandalism",
    "BURGLARY": "burglary",
    "MOTOR VEHICLE THEFT": "burglary",
    "DRUG/NARCOTIC VIOLATION": "drugs",
    "ARSON": "arson",
    "HOMICIDE": "homicide",
    "ROBBERY": "robbery",
    "SEX ABUSE": "sex_abuse"
}

# Calculate trends data from CSV files
def calculate_trends():
    trends_data = []

    # Load each CSV file and aggregate the data by crime type
    for year, file_path in csv_files.items():
        df = pd.read_csv(file_path)
        
        # Initialize a summary for each year
        crime_summary = {
            "date": year,
            "theft": 0,
            "assault": 0,
            "vandalism": 0,
            "burglary": 0,
            "drugs": 0,
            "arson": 0,
            "homicide": 0,
            "robbery": 0,
            "sex_abuse": 0
        }
        
        # Aggregate counts based on the offense type
        for offense, category in crime_category_mapping.items():
            crime_summary[category] += df[df['OFFENSE'] == offense].shape[0]
        
        trends_data.append(crime_summary)

    # Sort trends data by year in descending order
    trends_data.sort(key=lambda x: x['date'], reverse=True)
    
    return trends_data

# Endpoint to fetch and save the last 30 days' data
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

# Calculate crime data for dashboard
@app.get("/dashboard")
def analyze_data():
    if not os.path.exists(LOCAL_LAST30_FILE):
        return {"error": "Data file not found. Please fetch data first."}
    
    with open(LOCAL_LAST30_FILE, "r") as file:
        data = json.load(file)
    
    # Extract features containing crime information
    features = data.get("features", [])
    
    # Calculate total crime count
    total_crimes = len(features)
    
    # Calculate count by offense type
    offense_counter = Counter(feature["attributes"]["OFFENSE"] for feature in features)
    
    # Determine top crime type
    top_crime_type = offense_counter.most_common(1)[0] if offense_counter else ("N/A", 0)
    
    # Calculate count by ward (High Crime Zone)
    ward_counter = Counter(feature["attributes"]["WARD"] for feature in features)
    high_crime_zone = ward_counter.most_common(1)[0] if ward_counter else ("N/A", 0)
    
    # Calculate count by method of crime
    method_counter = Counter(feature["attributes"]["METHOD"] for feature in features)
    top_method = method_counter.most_common(1)[0] if method_counter else ("N/A", 0)
    
    # Calculate count by shift (time of crime)
    shift_counter = Counter(feature["attributes"]["SHIFT"] for feature in features)
    top_shift = shift_counter.most_common(1)[0] if shift_counter else ("N/A", 0)
    
    # Generate trends data from CSV files
    trends_data = calculate_trends()
    
    # Calculate distribution data for the last 30 days
    distribution_data = {category: 0 for category in crime_category_mapping.values()}
    for feature in features:
        offense = feature["attributes"]["OFFENSE"]
        category = crime_category_mapping.get(offense)
        if category:
            distribution_data[category] += 1

    return {
        "dashboard": {
            "overview": {
                "total_crimes": total_crimes,
                "top_crime_type": top_crime_type[0],
                "top_crime_count": top_crime_type[1],
                "high_crime_zone": high_crime_zone[0],
                "high_crime_count": high_crime_zone[1],
                "top_method": top_method[0],
                "top_method_count": top_method[1],
                "top_shift": top_shift[0],
                "top_shift_count": top_shift[1]
            },
            "trends": trends_data,
            "distribution": distribution_data
        }
    }
