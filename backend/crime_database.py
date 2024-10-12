# Create Tables for Crime Database

import mysql.connector

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


def populate_tables():
    '''Populate the tables'''
    pass

# create_tables()