# Create Tables for Crime Database

import mysql.connector
from datetime import datetime
import pandas as pd
import numpy as np

# Creating the connection
def establish_connection():
    try:
        conn = mysql.connector.connect(
            host="database-crime-dc.cxqaw406cjk5.us-east-1.rds.amazonaws.com",
            user="admin",
            password="capstonegroup10",
            port=3306,
            database="crime_database"
        )
        print("successful connection")
        return conn
    except mysql.connector.Error as err:
        print("Database connection failed:", err)
        return None
    

# establish connection
conn = establish_connection()

def create_tables():
    '''Create the tables'''
    if conn != None:
        cursor = conn.cursor()

        create_report_time_table = """
        CREATE TABLE IF NOT EXISTS report_time (
            ccn INT PRIMARY KEY,
            report_date_time TIMESTAMP,
            shift VARCHAR(20)
        );
        """

        create_report_location_table = """
        CREATE TABLE IF NOT EXISTS report_location (
            ccn INT,
            longitude DECIMAL(9, 6),
            latitude DECIMAL(9, 6),
            ward INT,
            neighborhood_clusters VARCHAR(50),
            anc VARCHAR(10),
            psa INT,
            voting_precinct VARCHAR(20),
            PRIMARY KEY (ccn),
            FOREIGN KEY (ccn) REFERENCES report_time(ccn)
        );
        """

        create_offense_and_method_table = """
        CREATE TABLE IF NOT EXISTS offense_and_method (
            ccn INT,
            offense VARCHAR(50),
            method VARCHAR(50),
            offense_group VARCHAR(50),
            ucr_rank INT,
            PRIMARY KEY (ccn),
            FOREIGN KEY (ccn) REFERENCES report_time(ccn)
        );
        """

        # Executing the queries
        cursor.execute(create_report_time_table)
        cursor.execute(create_report_location_table)
        cursor.execute(create_offense_and_method_table)

        # Committing the changes
        conn.commit()

        # Closing the connection
        cursor.close()
        conn.close()

        print("Tables created successfully.")


def insert_into_report_time(row, cursor):
    '''Populate report_time table'''

    query = """
    INSERT INTO report_time (ccn, report_date_time, shift)
    VALUES (%s, %s, %s)
    """
    ccn = row['CCN']
    report_date_time = datetime.strptime(row['REPORT_DAT'], '%m/%d/%Y, %I:%M:%S %p') if row['REPORT_DAT'] else None
    shift = row['SHIFT']
    cursor.execute(query, (ccn, report_date_time, shift))


def insert_into_report_location(row, cursor):
    '''Populate report_location table'''

    query = """
    INSERT INTO report_location (ccn, longitude, latitude, ward, neighborhood_clusters, anc, psa, voting_precinct)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    ccn = row['CCN']
    longitude = row['LONGITUDE']
    latitude = row['LATITUDE']
    ward = row['WARD']
    neighborhood_clusters = row['NEIGHBORHOOD_CLUSTER']
    anc = row['ANC']
    psa = row['PSA']
    voting_precinct = row['VOTING_PRECINCT']
    cursor.execute(query, (ccn, longitude, latitude, ward, neighborhood_clusters, anc, psa, voting_precinct))


def insert_into_offense_and_method(row, cursor):
    '''Populate offense_and_method table'''

    query = """
    INSERT IGNORE INTO offense_and_method (ccn, offense, method, offense_group, ucr_rank)
    VALUES (%s, %s, %s, %s, %s)
    """
    ccn = row['CCN']
    offense = row['OFFENSE']
    method = row['METHOD']
    offense_group = row['offensegroup']
    ucr_rank = row['ucr-rank']
    cursor.execute(query, (ccn, offense, method, offense_group, ucr_rank))


def populate_tables():
    '''Calls functions to populate all of the tables'''

    # create cursor if there is a connection
    if conn != None:
        cursor = conn.cursor()

        # Get csv (path will change based on users pc)
        csv_file_path = 'C:\\Users\marre\Downloads\Capstone_CS_5934\DC_Crime_Data_Past_5_Years.csv'
        data = pd.read_csv(csv_file_path)

        # data cleaning (replacing NaN with None and dropping any duplicate cases)
        data = data.replace({np.nan: None})
        data = data.drop_duplicates(subset=['CCN'])

        print ('inserting data')

        # Populate tables for each row
        count = 0
        for index, row in data.iterrows():
            insert_into_report_time(row, cursor)
            insert_into_report_location(row, cursor)
            insert_into_offense_and_method(row, cursor)
            if count % 1000 == 0:
                print("current at row:", count)
            count += 1

        print ('finished inserting data')

        # commit changes
        conn.commit()
        cursor.close()
        conn.close()


def delete_from_all_tables():
    '''Deletes everything from all of the tables'''
    if conn != None:
        cursor = conn.cursor()

        cursor.execute("DELETE FROM report_location;")
        cursor.execute("DELETE FROM offense_and_method;")
        cursor.execute("DELETE FROM report_time;")

        conn.commit()
        cursor.close()
        conn.close()

        print("All rows deleted from all tables successfully.")



def testing_database():
    '''Checking to make sure things imported correctly'''
    if conn != None:
        cursor = conn.cursor()

        cursor.execute("select * from report_time where ccn = 24070106")

        print(cursor.fetchall())




'''Function calls'''
# create_tables()
# populate_tables()
# delete_from_all_tables()
# testing_database()