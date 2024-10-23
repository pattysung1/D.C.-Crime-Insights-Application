import httpx
import json
from fastapi import FastAPI, Query, HTTPException
from collections import Counter
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import mysql.connector
import plotly.graph_objects as go
import plotly.io as pio
import reports
from typing import List
from pydantic import BaseModel
import pdfkit
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from fastapi import FastAPI, Request
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI
from pydantic import BaseModel
import mysql.connector
from langchain_community.utilities import SQLDatabase
from langchain_core.output_parsers import StrOutputParser



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
    "2024": "./Crime_Incidents/Crime_Incidents_in_2024.csv",
    "2023": "./Crime_Incidents/Crime_Incidents_in_2023.csv",
    "2022": "./Crime_Incidents/Crime_Incidents_in_2022.csv",
    "2021": "./Crime_Incidents/Crime_Incidents_in_2021.csv",
    "2020": "./Crime_Incidents/Crime_Incidents_in_2020.csv",
    "2019": "./Crime_Incidents/Crime_Incidents_in_2019.csv",
}

# Set up report path
REPORTS_DIR = Path("./generated_reports")
REPORTS_DIR.mkdir(exist_ok=True)

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

    # Sort trends data by year in ascending order
    trends_data.sort(key=lambda x: x['date'])

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
    offense_counter = Counter(
        feature["attributes"]["OFFENSE"] for feature in features)

    # Determine top crime type
    top_crime_type = offense_counter.most_common(
        1)[0] if offense_counter else ("N/A", 0)

    # Calculate count by ward (High Crime Zone)
    ward_counter = Counter(feature["attributes"]["WARD"]
                           for feature in features)
    high_crime_zone = ward_counter.most_common(
        1)[0] if ward_counter else ("N/A", 0)

    # Calculate count by method of crime
    method_counter = Counter(feature["attributes"]["METHOD"]
                             for feature in features)
    top_method = method_counter.most_common(
        1)[0] if method_counter else ("N/A", 0)

    # Calculate count by shift (time of crime)
    shift_counter = Counter(feature["attributes"]["SHIFT"]
                            for feature in features)
    top_shift = shift_counter.most_common(
        1)[0] if shift_counter else ("N/A", 0)

    # Generate trends data from CSV files
    trends_data = calculate_trends()

    # Calculate distribution data for the last 30 days
    distribution_data = {
        category: 0 for category in crime_category_mapping.values()}
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


@app.get("/crime-data")
def get_crime_data(crimeType: str = None, zone: str = None, startDate: str = None, endDate: str = None):
    if not os.path.exists(LOCAL_LAST30_FILE):
        return {"error": "Data file not found. Please fetch data first."}

    with open(LOCAL_LAST30_FILE, "r") as file:
        data = json.load(file)

    features = data.get("features", [])

    # Filter data
    filtered_data = []
    for idx, feature in enumerate(features):
        attributes = feature.get("attributes", {})
        lat = attributes.get("LATITUDE")
        lng = attributes.get("LONGITUDE")
        crime_type = attributes.get("OFFENSE")
        shift = attributes.get("SHIFT")
        # Assuming "WARD" represents the zone
        crime_zone = attributes.get("WARD")
        crime_date = attributes.get("REPORT_DAT")
        method = attributes.get("METHOD")  # Extract the method of crime

        # Filter by crime type
        if crimeType and crimeType != "All Crimes" and crime_type != crimeType:
            continue

        # Filter by zone
        if zone and zone != "All Zones" and crime_zone != zone:
            continue

        # Filter by date
        if startDate and endDate:
            try:
                crime_date_obj = pd.to_datetime(
                    crime_date)  # Convert date to DateTime format
                if not (pd.to_datetime(startDate) <= crime_date_obj <= pd.to_datetime(endDate)):
                    continue
            except Exception as e:
                print(f"Error parsing date for feature {idx}: {e}")
                continue

        # Add filtered data to the list
        filtered_data.append({
            "id": idx,
            "lat": lat,
            "lng": lng,
            "type": crime_type,
            "shift": shift,
            "zone": crime_zone,
            "date": crime_date,
            "method": method  # Include the method in the response
        })

    return filtered_data


@app.get("/crime-types")
def get_crime_types():
    if not os.path.exists(LOCAL_LAST30_FILE):
        return {"error": "Data file not found. Please fetch data first."}

    with open(LOCAL_LAST30_FILE, "r") as file:
        data = json.load(file)

    # Get all unique crime types (OFFENSE field)
    crime_types = list(set(feature["attributes"]["OFFENSE"]
                       for feature in data.get("features", [])))

    return crime_types


@app.get("/crime-zones")
def get_crime_zones():
    if not os.path.exists(LOCAL_LAST30_FILE):
        return {"error": "Data file not found. Please fetch data first."}

    with open(LOCAL_LAST30_FILE, "r") as file:
        data = json.load(file)

    # Get all unique crime zones (WARD field), excluding null values
    crime_zones = list(set(feature["attributes"]["WARD"]
                       for feature in data.get("features", [])
                       if feature["attributes"]["WARD"] is not None))

    return crime_zones

# Establish MySQL connection (using your existing function)


def establish_connection():
    try:
        conn = mysql.connector.connect(
            host="database-crime-dc.cxqaw406cjk5.us-east-1.rds.amazonaws.com",
            user="admin",
            password="capstonegroup10",
            port=3306,
            database="crime_database"
        )
        return conn
    except mysql.connector.Error as err:
        print("Database connection failed:", err)
        return None

# API endpoint to fetch total crimes by shift


@app.get("/crime-prediction")
def get_crime_prediction_data():
    conn = establish_connection()
    if conn is None:
        return {"error": "Failed to connect to the database."}

    try:
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT shift, COUNT(*) as total_crimes
            FROM report_time
            GROUP BY shift
        """
        cursor.execute(query)
        data = cursor.fetchall()  # Fetch all the rows as a list of dictionaries
    except mysql.connector.Error as err:
        return {"error": str(err)}
    finally:
        cursor.close()
        conn.close()

    # Convert the data into a DataFrame for Plotly
    df = pd.DataFrame(data)

    # Create a Plotly bar chart
    fig = go.Figure([go.Bar(x=df['shift'], y=df['total_crimes'])])
    fig.update_layout(title="Total Crimes by Shift",
                      xaxis_title="Shift", yaxis_title="Total Crimes")

    # Render the figure as an HTML div
    chart_html = pio.to_html(fig, full_html=False)

    return {"chart": chart_html}


class CrimeReport(BaseModel):
    ccn: str  # Ensure CCN is a string
    REPORT_DAT: str  # Ensure REPORT_DAT is a string
    SHIFT: str
    offense: str
    method: str
    ward: str  # Ensure ward is a string
    neighborhood_clusters: str


def load_data_from_db():
    mydb = establish_connection()
    if mydb is None:
        return None

    try:
        # Join the three tables using the ccn column to fetch comprehensive crime data
        query = """
            SELECT 
                r.ccn, 
                r.report_date_time AS REPORT_DAT, 
                r.shift AS SHIFT, 
                l.ward, 
                l.neighborhood_clusters, 
                o.offense AS offense, 
                o.method AS method, 
                o.offense_group AS offense_group, 
                o.ucr_rank AS ucr_rank, 
                l.longitude, 
                l.latitude
            FROM 
                report_time r
            INNER JOIN 
                report_location l ON r.ccn = l.ccn
            INNER JOIN 
                offense_and_method o ON r.ccn = o.ccn;
        """
        # Fetch the data into a DataFrame
        df = pd.read_sql(query, mydb)

        # Ensure the REPORT_DAT field is in datetime format for filtering
        df['REPORT_DAT'] = pd.to_datetime(df['REPORT_DAT'], errors='coerce')

        # Check if 'REPORT_DAT' is timezone-aware or not and localize/convert accordingly
        if df['REPORT_DAT'].dt.tz is None:
            df['REPORT_DAT'] = df['REPORT_DAT'].dt.tz_localize('UTC')
        else:
            df['REPORT_DAT'] = df['REPORT_DAT'].dt.tz_convert('UTC')

        return df
    except Exception as e:
        print(f"Failed to load data from database: {str(e)}")
        return None
    finally:
        mydb.close()

# Endpoint to get crime report data based on date and location
# @app.get("/report", response_model=List[dict])  # Assuming the response model is a list of dictionaries
# def get_report(start_date: str, end_date: str, location: str):
#     # Load data from the database
#     df = load_data_from_db()
#     if df is None:
#         return {"error": "Failed to load data from the database."}

#     # Filter the DataFrame based on provided parameters
#     filtered_data = df[
#         (df['REPORT_DAT'] >= pd.to_datetime(start_date)) &
#         (df['REPORT_DAT'] <= pd.to_datetime(end_date)) &
#         (df['neighborhood_clusters'] == location)
#     ]

#     if filtered_data.empty:
#         return {"error": "No data available for the specified filters."}

#     return filtered_data.to_dict(orient='records')  # Return the filtered data as a list of dictionaries

# @app.get("/report", response_model=List[CrimeReport])
# def get_report(start_date: str, end_date: str, location: str):
#     # Load data from the database
#     df = load_data_from_db()
#     if df is None:
#         return []  # Return an empty list instead of an error message

#     # Convert start_date and end_date to timezone-aware UTC datetimes
#     try:
#         start_date_utc = pd.to_datetime(start_date).tz_localize('UTC')
#         end_date_utc = pd.to_datetime(end_date).tz_localize('UTC')
#     except Exception as e:
#         return []  # Return an empty list if date parsing fails

#     # Filter the DataFrame based on provided parameters
#     filtered_data = df[
#         (df['REPORT_DAT'] >= start_date_utc) &
#         (df['REPORT_DAT'] <= end_date_utc) &
#         (df['neighborhood_clusters'] == location)
#     ]

#     if filtered_data.empty:
#         return []  # Return an empty list if no data is found

#     return filtered_data.to_dict(orient='records')  # Return the filtered data as a list of dictionaries

# @app.get("/report", response_model=List[CrimeReport])
# def get_report(start_date: str, end_date: str, location: str):
#     # Load data from the database
#     df = load_data_from_db()
#     if df is None:
#         return {"error": "Failed to load data from the database."}

#     # Convert start_date and end_date to UTC
#     start_date = pd.to_datetime(start_date).tz_localize('UTC')
#     end_date = pd.to_datetime(end_date).tz_localize('UTC')

#     # Filter the DataFrame based on provided parameters
#     filtered_data = df[
#         (df['REPORT_DAT'] >= start_date) &
#         (df['REPORT_DAT'] <= end_date) &
#         (df['neighborhood_clusters'] == location)
#     ]

#     if filtered_data.empty:
#         return {"error": "No data available for the specified filters."}

#     # Convert fields to string before returning
#     result = filtered_data.to_dict(orient='records')
#     for row in result:
#         row['ccn'] = str(row['ccn'])  # Convert CCN to string
#         row['REPORT_DAT'] = row['REPORT_DAT'].strftime('%Y-%m-%d %H:%M:%S')  # Convert datetime to string
#         row['ward'] = str(row['ward'])  # Convert ward to string

#     return result  # Return the filtered data as a list of dictionaries


@app.get("/report", response_model=List[CrimeReport])
def get_report(start_date: str, end_date: str, location: str):
    # Load data from the database
    df = load_data_from_db()
    if df is None:
        return []  # Return an empty list instead of an error dictionary

    # Convert start_date and end_date to UTC
    start_date = pd.to_datetime(start_date).tz_localize('UTC')
    end_date = pd.to_datetime(end_date).tz_localize('UTC')

    # Filter the DataFrame based on provided parameters
    filtered_data = df[
        (df['REPORT_DAT'] >= start_date) &
        (df['REPORT_DAT'] <= end_date) &
        (df['neighborhood_clusters'].str.lower() ==
         location.lower())  # Make case insensitive
    ]

    if filtered_data.empty:
        return []  # Return an empty list if no data is found

    # Convert fields to string before returning
    result = filtered_data.to_dict(orient='records')
    for row in result:
        row['ccn'] = str(row['ccn'])  # Convert CCN to string
        row['REPORT_DAT'] = row['REPORT_DAT'].strftime(
            '%Y-%m-%d %H:%M:%S')  # Convert datetime to string
        row['ward'] = str(row['ward'])  # Convert ward to string

    return result  # Return the filtered data as a list of dictionaries


# Function to load neighborhood clusters from the DataFrame
@app.get("/neighborhood_clusters")
def get_neighborhood_clusters():
    df = load_data_from_db()  # Load data into DataFrame
    if df is None:
        return {"error": "Failed to load data from the database."}

    # Filter out None or empty values from neighborhood_clusters before sorting
    valid_clusters = [cluster for cluster in df['neighborhood_clusters'].unique(
    ) if isinstance(cluster, str) and cluster.strip()]
    sorted_clusters = sorted(valid_clusters)  # Sort clusters alphabetically

    return sorted_clusters  # Return the sorted list of neighborhoods


# Update download_report
@app.get("/download_report")
async def download_report(name: str, start_date: str, end_date: str, location: str):
    try:
        report_data = get_report(start_date, end_date, location)

        filename = f"crime_report_{name}_{start_date}_{end_date}.pdf"
        file_path = REPORTS_DIR / filename

        html_content = f"""
        <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; }}
                    h1 {{ text-align: center; color: #333; }}
                    table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
                    th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                    th {{ background-color: #f5f5f5; }}
                </style>
            </head>
            <body>
                <h1>Crime Report</h1>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Date Range:</strong> {start_date} to {end_date}</p>
                <p><strong>Generated for:</strong> {name}</p>
                
                <table>
                    <thead>
                        <tr>
                            <th>CCN</th>
                            <th>Report Date</th>
                            <th>Shift</th>
                            <th>Offense</th>
                            <th>Method</th>
                            <th>Ward</th>
                            <th>Neighborhood</th>
                        </tr>
                    </thead>
                    <tbody>
        """

        # Add form data
        for item in report_data:
            html_content += f"""
                <tr>
                    <td>{item.get('ccn', '')}</td>
                    <td>{item.get('REPORT_DAT', '')}</td>
                    <td>{item.get('SHIFT', '')}</td>
                    <td>{item.get('offense', '')}</td>
                    <td>{item.get('method', '')}</td>
                    <td>{item.get('ward', '')}</td>
                    <td>{item.get('neighborhood_clusters', '')}</td>
                </tr>
            """

        html_content += """
                    </tbody>
                </table>
            </body>
        </html>
        """

        # Set up pdfkit Options
        options = {
            'page-size': 'A4',
            'margin-top': '0.75in',
            'margin-right': '0.75in',
            'margin-bottom': '0.75in',
            'margin-left': '0.75in',
            'encoding': "UTF-8",
        }

        # Generate PDF
        pdfkit.from_string(html_content, str(file_path), options=options)

        # Return file
        if not file_path.exists():
            raise HTTPException(
                status_code=404, detail="Report generation failed")

        return FileResponse(
            path=str(file_path),
            filename=filename,
            media_type='application/pdf',
            headers={
                "Access-Control-Expose-Headers": "Content-Disposition",
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/generate_report")
def generate_report(name: str, start_date: str, end_date: str, location: str):
    report_html = f"<html><body><h1>Report for {name}</h1><p>Start Date: {start_date}</p><p>End Date: {end_date}</p><p>Location: {location}</p></body></html>"
    file_path = f"./generated_reports/{name}_crime_report.pdf"
    pdfkit.from_string(report_html, file_path)
    return {"message": "Report generated successfully", "file_path": file_path}





# for ChatBot
# Define a class to receive user messages
class ChatRequest(BaseModel):
    message: str

OPENAI_API_KEY = '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'

# Initialize database connection
def init_database():
    user = "admin"
    password = "capstonegroup10"
    host = "database-crime-dc.cxqaw406cjk5.us-east-1.rds.amazonaws.com"
    port = 3306
    database = "crime_database"
    
    db_uri = f"mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}"
    return SQLDatabase.from_uri(db_uri)

# Define AI response logic
def get_sql_chain(db):
    template = """
    You are a data analyst at a company. You are interacting with a user who is asking you questions about the company's database.
    Based on the table schema below, write a SQL query that would answer the user's question. Take the conversation history into account.
    
    <SCHEMA>{schema}</SCHEMA>
    
    Conversation History: {chat_history}
    
    Write only the SQL query and nothing else. Do not wrap the SQL query in any other text, not even backticks.
    
    Question: {question}
    SQL Query:
    """
    prompt = ChatPromptTemplate.from_template(template)
    llm = ChatOpenAI(model="gpt-4-0125-preview", openai_api_key=OPENAI_API_KEY)

    def get_schema(_):
        return db.get_table_info()
  
    return (
        RunnablePassthrough.assign(schema=get_schema)
        | prompt
        | llm
        | StrOutputParser()
    )

@app.post("/chatbot")
async def chatbot(request: ChatRequest):
    user_message = request.message

    # Connect to the MySQL database
    db = init_database()

    # Generate a response
    response = get_response(user_message, db, [])
    
    return {"response": response}
    
def get_response(user_query: str, db: SQLDatabase, chat_history: list):
    sql_chain = get_sql_chain(db)

    template = """
    You are a crime analyst. You are interacting with a user who is asking you questions about the company's crime database.
    Based on the table schema below, user question, SQL query, and SQL response, write a natural language response that clearly explains the results of the query, including any patterns, trends, or significant insights from the data.
    <SCHEMA>{schema}</SCHEMA>

    Conversation History: {chat_history}
    SQL Query: <SQL>{query}</SQL>
    User question: {question}
    SQL Response: {response}"""
  
    prompt = ChatPromptTemplate.from_template(template)
    
    # Pass API key here
    llm = ChatOpenAI(model="gpt-4-0125-preview", openai_api_key=OPENAI_API_KEY)
  
    chain = (
        RunnablePassthrough.assign(query=sql_chain).assign(
          schema=lambda _: db.get_table_info(),
          response=lambda vars: db.run(vars["query"]),
        )
        | prompt
        | llm
        | StrOutputParser()
    )
  
    return chain.invoke({
        "question": user_query,
        "chat_history": chat_history,
    })


