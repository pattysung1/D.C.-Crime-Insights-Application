import mysql.connector
import requests
from datetime import datetime, timedelta
import json

# Establishing the database connection
def establish_connection():
    try:
        conn = mysql.connector.connect(
            host="database-crime-dc.cxqaw406cjk5.us-east-1.rds.amazonaws.com",
            user="admin",
            password="capstonegroup10",
            port=3306,
            database="crime_database"
        )
        print("Successful connection")
        return conn
    except mysql.connector.Error as err:
        print("Database connection failed:", err)
        return None

# Fetching and formatting the crime data from the last 30 days
def fetch_crime_data():
    ucr_rank_mapping = {
        "THEFT F/AUTO": 7,
        "THEFT/OTHER": 6,
        "MOTOR VEHICLE THEFT": 8,
        "HOMICIDE": 1,
        "ROBBERY": 4,
        "BURGLARY": 5,
        "ASSAULT W/DANGEROUS WEAPON": 3,
        "SEX ABUSE": 2,
        "ARSON": 4
    }
    offense_group_mapping = {
        "THEFT F/AUTO": "property",
        "THEFT/OTHER": "property",
        "MOTOR VEHICLE THEFT": "property",
        "HOMICIDE": "violent",
        "ROBBERY": "violent",
        "BURGLARY": "property",
        "ASSAULT W/DANGEROUS WEAPON": "violent",
        "SEX ABUSE": "violent",
        "ARSON": "property"
    }

    # Fetch data from API
    url = "https://maps2.dcgis.dc.gov/dcgis/rest/services/FEEDS/MPD/MapServer/8/query?where=1%3D1&outFields=CCN,REPORT_DAT,SHIFT,LATITUDE,LONGITUDE,WARD,NEIGHBORHOOD_CLUSTER,ANC,PSA,VOTING_PRECINCT,METHOD,OFFENSE&outSR=4326&f=json&orderByFields=REPORT_DAT DESC&resultRecordCount=1000"
    data = requests.get(url).json()

    crime_data = []
    for feature in data['features']:
        attributes = feature['attributes']

        # Convert timestamp to date format
        report_date = None
        if attributes["REPORT_DAT"] is not None:
            report_date_timestamp = attributes["REPORT_DAT"] / 1000  # Convert to seconds
            report_date = datetime.fromtimestamp(report_date_timestamp).strftime('%Y-%m-%d %H:%M:%S')
            report_date_final = datetime.strptime(report_date, '%Y-%m-%d %H:%M:%S')

        offense = attributes.get("OFFENSE", "").upper()
        ucr_rank = ucr_rank_mapping.get(offense, None)
        offense_group = offense_group_mapping.get(offense, None)

        crime_entry = {
            "CCN": attributes["CCN"],
            "REPORT_DAT": report_date_final,
            "SHIFT": attributes["SHIFT"],
            "LATITUDE": attributes["LATITUDE"],
            "LONGITUDE": attributes["LONGITUDE"],
            "WARD": attributes["WARD"],
            "NEIGHBORHOOD_CLUSTER": attributes["NEIGHBORHOOD_CLUSTER"],
            "ANC": attributes["ANC"],
            "PSA": attributes["PSA"],
            "VOTING_PRECINCT": attributes["VOTING_PRECINCT"],
            "METHOD": attributes["METHOD"],
            "OFFENSE": attributes["OFFENSE"],
            "UCR_RANK": ucr_rank,
            "OFFENSE_GROUP": offense_group
        }
        crime_data.append(crime_entry)

    return crime_data

# Insert crime data into the database
def insert_crime_data(conn, crime_data):
    if conn is None:
        print("No database connection.")
        return

    try:
        cursor = conn.cursor()

        check_ccn_query = "SELECT COUNT(*) FROM report_time WHERE ccn = %s"
        insert_report_time_query = """
            INSERT INTO report_time (ccn, report_date_time, shift)
            VALUES (%s, %s, %s)
        """
        insert_report_location_query = """
            INSERT INTO report_location (ccn, longitude, latitude, ward, neighborhood_clusters, anc, psa, voting_precinct)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        insert_offense_and_method_query = """
            INSERT INTO offense_and_method (ccn, offense, method, offense_group, ucr_rank)
            VALUES (%s, %s, %s, %s, %s)
        """

        count = 0
        for entry in crime_data:

            # Convert specified fields to lowercase
            shift = entry["SHIFT"].lower() if entry["SHIFT"] else None
            neighborhood_cluster = entry["NEIGHBORHOOD_CLUSTER"].lower() if entry["NEIGHBORHOOD_CLUSTER"] else None
            voting_precinct = entry["VOTING_PRECINCT"].lower() if entry["VOTING_PRECINCT"] else None
            offense = entry["OFFENSE"].lower() if entry["OFFENSE"] else None
            method = entry["METHOD"].lower() if entry["METHOD"] else None
            offense_group = entry["OFFENSE_GROUP"].lower() if entry["OFFENSE_GROUP"] else None

            cursor.execute(check_ccn_query, (entry["CCN"],))
            if cursor.fetchone()[0] == 0:  # If CCN does not exist

                # Insert into report_time
                cursor.execute(insert_report_time_query, (
                    entry["CCN"],
                    entry["REPORT_DAT"],
                    shift
                ))

                # Insert into report_location
                cursor.execute(insert_report_location_query, (
                    entry["CCN"],
                    entry["LONGITUDE"],
                    entry["LATITUDE"],
                    entry["WARD"],
                    neighborhood_cluster,
                    entry["ANC"],
                    entry["PSA"],
                    voting_precinct
                ))

                # Insert into offense_and_method
                cursor.execute(insert_offense_and_method_query, (
                    entry["CCN"],
                    offense,
                    method,
                    offense_group,
                    entry["UCR_RANK"]
                ))
                count += 1

        conn.commit()
        print("Data inserted successfully.")
        print("Number of rows inserted:", str(count))
    except mysql.connector.Error as err:
        print("Error while inserting data:", err)
    finally:
        cursor.close()

# Lambda handler
def lambda_handler(event, context):
    conn = establish_connection()
    if conn:
        crime_data = fetch_crime_data()
        insert_crime_data(conn, crime_data)
        conn.close()
    return {
        "statusCode": 200,
        "body": "Data processed and inserted successfully."
    }