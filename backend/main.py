import httpx
import json
from fastapi import FastAPI
from collections import Counter
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import mysql.connector
import plotly.graph_objects as go
import plotly.io as pio
from datetime import datetime, timedelta

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

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
@app.get("/dashboard")
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


@app.get("/crime-data")
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


@app.get("/crime-types")
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

@app.get("/crime-zones")
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
    fig.update_layout(title="Total Crimes by Shift", xaxis_title="Shift", yaxis_title="Total Crimes")

    # Render the figure as an HTML div
    chart_html = pio.to_html(fig, full_html=False)

    return {"chart": chart_html}