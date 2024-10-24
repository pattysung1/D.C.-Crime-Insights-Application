import requests

print(requests.get("http://127.0.0.1:8000/").json())

print(requests.get("http://127.0.0.1:8000/dashboard").json())
print(requests.get("http://127.0.0.1:8000/crime-data").json())

# Test the report generation API
print(requests.get("http://127.0.0.1:8000/report").json())
 