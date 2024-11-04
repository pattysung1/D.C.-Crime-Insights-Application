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


from datetime import datetime, timedelta

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://54.225.57.155"], # Your React app's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Set up report path
REPORTS_DIR = Path("./generated_reports")
REPORTS_DIR.mkdir(exist_ok=True)

# Mapping for offense types to broader categories
crime_category_mapping = {
    "theft/other": "theft (non auto)",
    "theft f/auto": "theft auto",
    "assault w/dangerous weapon": "assault with weapon",
    "homicide": "homicide",
    "motor vehicle theft": "motor vehicle theft",
    "burglary": "burglary",
    "robbery": "robbery",
    "sex abuse": "sex abuse",
    "arson": "arson",
}

# Calculate trends data from CSV files


def calculate_trends():

    conn = establish_connection()
    if conn is None:
        return {"error": "Failed to connect to the database."}
    
    trends_data = []
    try:
        cursor = conn.cursor(dictionary=True)

        # Crime counts grouped by offense and year
        for year in range(2019, 2025):  # Data from 2019-2024
            query = f"""
                SELECT offense, COUNT(*) as count
                FROM report_time rt
                JOIN offense_and_method om ON rt.ccn = om.ccn
                WHERE YEAR(rt.report_date_time) = {year}
                GROUP BY offense;
            """
            cursor.execute(query)
            results = cursor.fetchall()

            # Initialize a summary for each year
            crime_summary = {
                "date": year,
            }

            # Map the offenses to broader categories
            for row in results:
                if row['offense'] == 'theft/other':
                    crime_summary['theft (non auto)'] = row['count']
                if row['offense'] == 'theft f/auto':
                    crime_summary['theft (auto)'] = row['count']
                if row['offense'] == 'assault w/dangerous weapon':
                    crime_summary['assault with weapon'] = row['count']
                else:
                    crime_summary[row['offense']] = row['count']
                

            trends_data.append(crime_summary)

    except mysql.connector.Error as err:
        return {"error": str(err)}
    finally:
        cursor.close()
        conn.close()

    # Sort trends data by year in ascending order
    trends_data.sort(key=lambda x: x['date'])

    return trends_data


# Calculate crime data for dashboard

@app.get("/api/dashboard")
def analyze_data():

    conn = establish_connection()
    if conn is None:
        return {"error": "Failed to connect to the database."}

    try:
        cursor = conn.cursor(dictionary=True)

        # Query the last 30 days' data from the database
        query = """
            SELECT om.offense, rl.ward, om.method, rt.shift
            FROM report_time rt
            JOIN offense_and_method om ON rt.ccn = om.ccn
            JOIN report_location rl ON rt.ccn = rl.ccn
            WHERE rt.report_date_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);
        """
        cursor.execute(query)
        features = cursor.fetchall()

        if not features:
            return {"message": "No data available for the last 30 days"}

        # Calculate total crime count
        total_crimes = len(features)

        # Calculate count by offense type
        offense_counter = Counter(feature["offense"] for feature in features)

        # Determine top crime type
        top_crime_type = offense_counter.most_common(1)[0] if offense_counter else ("N/A", 0)

        # Calculate count by ward (High Crime Zone)
        ward_counter = Counter(feature["ward"] for feature in features)
        high_crime_zone = ward_counter.most_common(1)[0] if ward_counter else ("N/A", 0)

        # Calculate count by method of crime
        method_counter = Counter(feature["method"] for feature in features)
        top_method = method_counter.most_common(1)[0] if method_counter else ("N/A", 0)

        # Calculate count by shift (time of crime)
        shift_counter = Counter(feature["shift"] for feature in features)
        top_shift = shift_counter.most_common(1)[0] if shift_counter else ("N/A", 0)

        # Generate trends data from the MySQL database
        trends_data = calculate_trends()

        # Calculate distribution data for the last 30 days
        distribution_data = {category: 0 for category in crime_category_mapping.values()}
        for feature in features:
            category = crime_category_mapping.get(feature["offense"])
            if category:
                distribution_data[category] += 1
            else:
                # Add a "miscellaneous" category if the offense isn't mapped
                distribution_data["miscellaneous"] = distribution_data.get("miscellaneous", 0) + 1

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

    except mysql.connector.Error as err:
        return {"error": str(err)}
    finally:
        cursor.close()
        conn.close()

@app.get("/api/test")
async def test_endpoint():
    return {"status": "test endpoint working"}

@app.get("/api/crime-data")
def get_crime_data(crimeType: str = None, zone: str = None, startDate: str = None, endDate: str = None):
    conn = establish_connection()
    if conn is None:
        return {"error": "Failed to connect to the database."}

    try:
        if not startDate:
            startDate = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d")
        if not endDate:
            endDate = datetime.now().strftime("%Y-%m-%d")

        cursor = conn.cursor(dictionary=True)

        # Base query to join all necessary tables
        query = """
        SELECT rt.ccn, rt.report_date_time AS crime_date, rt.shift, rl.latitude, rl.longitude, rl.ward AS crime_zone, 
               om.offense AS crime_type, om.method
        FROM report_time rt
        JOIN report_location rl ON rt.ccn = rl.ccn
        JOIN offense_and_method om ON rt.ccn = om.ccn
        WHERE 1 = 1
        """

        # Parameters for filtering
        params = []

        # Filter by crime type
        if crimeType and crimeType != "All Crimes":
            query += " AND om.offense = %s"
            params.append(crimeType)

        # Filter by zone
        if zone and zone != "All Zones":
            query += " AND rl.ward = %s"
            params.append(zone)

        # Filter by date range (default or provided)
        query += " AND rt.report_date_time BETWEEN %s AND %s"
        params.extend([startDate, endDate])

        # Execute the query with the filters applied
        cursor.execute(query, params)
        result = cursor.fetchall()

       # Format the result
        filtered_data = []
        for idx, row in enumerate(result):
            crime_date_obj = pd.to_datetime(row['crime_date'])  # Parse date
            filtered_data.append({
                "id": idx,
                "lat": row['latitude'],
                "lng": row['longitude'],
                "type": row['crime_type'],
                "shift": row['shift'],
                "zone": row['crime_zone'],
                "date": crime_date_obj.strftime("%Y-%m-%d %H:%M:%S"),
                "method": row['method']
            })

        return filtered_data

    except mysql.connector.Error as err:
        return {"error": str(err)}
    finally:
        cursor.close()
        conn.close()


@app.get("/api/crime-types")
def get_crime_types():
    conn = establish_connection()
    if conn is None:
        return {"error": "Failed to connect to the database."}

    try:
        cursor = conn.cursor(dictionary=True)

        # Query to get all unique crime types (offenses)
        query = """
            SELECT DISTINCT offense
            FROM offense_and_method
            WHERE offense IS NOT NULL;
        """
        cursor.execute(query)
        types = cursor.fetchall()

        # Extract offenses into a list
        crime_types = [type_['offense'] for type_ in types]

        return crime_types

    except mysql.connector.Error as err:
        return {"error": str(err)}
    finally:
        cursor.close()
        conn.close()

@app.get("/api/crime-zones")
def get_crime_zones():
    conn = establish_connection()
    if conn is None:
        return {"error": "Failed to connect to the database."}

    try:
        cursor = conn.cursor(dictionary=True)

        # Query to get all unique crime zones (wards)
        query = """
            SELECT DISTINCT ward
            FROM report_location
            WHERE ward IS NOT NULL;
        """
        cursor.execute(query)
        zones = cursor.fetchall()

        # Extract wards into a list
        crime_zones = [zone['ward'] for zone in zones]

        return crime_zones

    except mysql.connector.Error as err:
        return {"error": str(err)}
    finally:
        cursor.close()
        conn.close()

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


@app.get("/api/crime-prediction")
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


@app.get("/api/report", response_model=List[CrimeReport])
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
@app.get("/api/neighborhood_clusters")
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
@app.get("/api/download_report")
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


@app.get("/api/generate_report")
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

@app.post("/api/chatbot")
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


# for stacked bar chart
def calculate_monthly_crime_data():
    conn = establish_connection()
    if conn is None:
        return {"error": "Failed to connect to the database."}
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        # Query to get crime counts grouped by offense and month
        query = """
            SELECT 
                MONTH(rt.report_date_time) as month, 
                om.offense, 
                COUNT(*) as count
            FROM report_time rt
            JOIN offense_and_method om ON rt.ccn = om.ccn
            WHERE YEAR(rt.report_date_time) = YEAR(CURDATE())
            GROUP BY month, om.offense
            ORDER BY month;
        """
        cursor.execute(query)
        results = cursor.fetchall()

        # print("Fetched monthly crime data from database:", results)

        # Initialize monthly data dictionary with each month and crime types
        # monthly_crime_data = {month: {category: 0 for category in crime_category_mapping.values()} for month in range(1, 13)}
        monthly_crime_data = {month: {category: 0 for category in list(crime_category_mapping.values()) + ["miscellaneous"]} for month in range(1, 13)}

        # Populate the monthly crime data
        for row in results:
            month = row["month"]
            offense = row["offense"]
            count = row["count"]

            # Map the offense to a broader category using the crime_category_mapping
            category = crime_category_mapping.get(offense, "miscellaneous")
            monthly_crime_data[month][category] += count

        # Convert the dictionary to a list of objects for easier frontend handling
        monthly_crime_data_list = []
        for month, data in monthly_crime_data.items():
            data["month"] = month
            monthly_crime_data_list.append(data)

        return monthly_crime_data_list

    except mysql.connector.Error as err:
        return {"error": str(err)}
    finally:
        cursor.close()
        conn.close()

@app.get("/api/monthly-crime-data")
def get_monthly_crime_data():
    monthly_data = calculate_monthly_crime_data()
    if "error" in monthly_data:
        raise HTTPException(status_code=500, detail=monthly_data["error"])
    return monthly_data
