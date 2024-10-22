import os
import pandas as pd
from datetime import datetime
from sqlalchemy import create_engine

# Function to establish connection using SQLAlchemy
def establish_connection():
    try:
        # Create a SQLAlchemy engine using MySQL
        engine = create_engine(
            "mysql+pymysql://admin:capstonegroup10@database-crime-dc.cxqaw406cjk5.us-east-1.rds.amazonaws.com/crime_database"
        )
        return engine
    except Exception as err:
        print(f"Error: {err}")
        return None

# Function to load data from the database using SQLAlchemy
def load_data():
    engine = establish_connection()
    if engine is None:
        return None

    try:
        query = """
        SELECT 
            r.ccn, 
            r.report_date_time AS REPORT_DAT, 
            r.shift AS SHIFT, 
            l.ward, 
            l.neighborhood_clusters AS neighborhood_clusters, 
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
        # Use SQLAlchemy engine with pandas read_sql
        df = pd.read_sql(query, engine)

        # Ensure 'REPORT_DAT' is in datetime format
        df['REPORT_DAT'] = pd.to_datetime(df['REPORT_DAT'], errors='coerce')

        # Make 'REPORT_DAT' timezone-aware if it's not already
        if df['REPORT_DAT'].dt.tz is None:
            df['REPORT_DAT'] = df['REPORT_DAT'].dt.tz_localize('UTC')

        return df
    except Exception as e:
        print(f"Failed to load data: {e}")
        return None

def generate_report(start_date=None, end_date=None, location=None):
    # Load data from the database
    df = load_data()
    if df is None:
        return {"error": "Failed to load data from the database."}

    # Convert the input start_date and end_date to timezone-aware datetime
    start_date = pd.to_datetime(start_date).tz_localize('UTC')
    end_date = pd.to_datetime(end_date).tz_localize('UTC')

    # Filter data by date and location
    filtered_data = df[
        (df['REPORT_DAT'] >= start_date) &
        (df['REPORT_DAT'] <= end_date) &
        (df['neighborhood_clusters'] == location)
    ]

    if filtered_data.empty:
        return {"error": "No data available for the specified filters."}

    # Calculate summary statistics
    total_incidents = len(filtered_data)
    most_common_offense = filtered_data['offense'].mode()[0] if not filtered_data.empty else "N/A"
    busiest_day = filtered_data['REPORT_DAT'].dt.day_name().mode()[0] if not filtered_data.empty else "N/A"
    busiest_time = filtered_data['SHIFT'].mode()[0] if not filtered_data.empty else "N/A"

    # Return the report data
    report_data = {
        "total_incidents": total_incidents,
        "most_common_offense": most_common_offense,
        "busiest_day": busiest_day,
        "busiest_time": busiest_time,
        "start_date": start_date.strftime('%Y-%m-%d'),
        "end_date": end_date.strftime('%Y-%m-%d'),
        "location": location
    }

    return report_data
