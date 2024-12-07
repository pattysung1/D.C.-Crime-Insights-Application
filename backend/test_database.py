import unittest
import mysql.connector

class TestCrimeDatabase(unittest.TestCase):
    """Unit tests for the CrimeDatabase."""
    def setUp(self):
        # Establish a connection to the database
        self.conn = mysql.connector.connect(
            host="database-crime-dc.cxqaw406cjk5.us-east-1.rds.amazonaws.com",
            user="admin",
            password="capstonegroup10",
            port=3306,
            database="crime_database"
        )
        self.cursor = self.conn.cursor()

    def tearDown(self):
        # Close the connection
        self.cursor.close()
        self.conn.close()

    def test_row_counts(self):
        """Ensure the row counts in all tables are consistent."""
        self.cursor.execute("SELECT COUNT(*) FROM report_time;")
        report_time_count = self.cursor.fetchone()[0]

        self.cursor.execute("SELECT COUNT(*) FROM report_location;")
        report_location_count = self.cursor.fetchone()[0]

        self.cursor.execute("SELECT COUNT(*) FROM offense_and_method;")
        offense_and_method_count = self.cursor.fetchone()[0]

        # Assert all counts are equal since CCN should match across tables
        self.assertEqual(report_time_count, report_location_count)
        self.assertEqual(report_time_count, offense_and_method_count)

    def test_non_null_values(self):
        """Ensure critical fields do not have NULL values."""
        self.cursor.execute("SELECT COUNT(*) FROM report_time WHERE ccn IS NULL;")
        null_ccn_count = self.cursor.fetchone()[0]
        self.assertEqual(null_ccn_count, 0)

    def test_foreign_keys_integrity(self):
        """Ensure all CCNs in foreign key tables exist in report_time."""
        self.cursor.execute("""
            SELECT ccn FROM report_location
            WHERE ccn NOT IN (SELECT ccn FROM report_time);
        """)
        missing_ccns = self.cursor.fetchall()
        self.assertEqual(len(missing_ccns), 0)

        self.cursor.execute("""
            SELECT ccn FROM offense_and_method
            WHERE ccn NOT IN (SELECT ccn FROM report_time);
        """)
        missing_ccns = self.cursor.fetchall()
        self.assertEqual(len(missing_ccns), 0)

    def test_recent_updates(self):
        """Check if rows were inserted in the last two days."""
        # Check for rows within the last two calendar days
        self.cursor.execute("""
            SELECT COUNT(*), MIN(report_date_time), MAX(report_date_time)
            FROM report_time
            WHERE DATE(report_date_time) >= CURDATE() - INTERVAL 2 DAY;
        """)
        
        result = self.cursor.fetchone()
        recent_count, min_date, max_date = result

        # Log debug information
        print(f"Test Recent Updates Debug Info (Last 2 Days):")
        print(f"Recent Count: {recent_count}")
        print(f"Earliest Recent Report: {min_date}")
        print(f"Latest Recent Report: {max_date}")

        # Assert there are rows within the last two days
        self.assertGreater(recent_count, 0, "No rows found in the last two days.")

if __name__ == '__main__': unittest.main()