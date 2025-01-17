<<<<<<< HEAD

# D.C Crime Insights Application

## Before you Begin

Users planning on running this application should have Node.js and Python installed, as well as the latest versions of the windows, mac, or linux operating systems.

## Description

The D.C. Crime Insights Application can be used to analyze valuable data regarding D.C. crime statistics. The application has multiple different pages that serve different functions.

### Features

- Dashboard: Provides high level information such as general statistics over the past 30 days, Past 12 months, and Crime Trends over the past few years using a variety of different graphs to display information in a clean and concise format.
- CrimeMap: This page can be used to display crimes across D.C. and can filter crimes by the crime type, crime zone, and date range over the past 30 days.
- Reports: This page can take dates from a specified range, as well as a neighborhood cluster to generate a report of information regarding various data for the users on the webpage.
- Crime Prediction: This page contains two sections. The Linear Regression Graph tab contains a linear regression graph that can be used to help predict the number of crimes that will occur for a specific method in D.C. over the coming weeks. The Advanced Predictions tab can be used to predict the number of crimes that will predict over a certain timeframe for a specified region. Both of these tools are very valuable for helping users predict future crimes trends.
- Safe Routing: This page takes start and destination locations and generates a safe route for the user to take by leveraging past crime data.
- Public Safety Resources: The page provides various resouces users can look at to help report crimes or keep them safe.
- Settings: This page can be used to change the colors in the sidebar to help make the application look nicer.

Features Not Specifically in the Application:

- Live Database Hosted Using AWS: The database is currently hosted on Amazon RDS. All calls used to gather data in the application pull data from the tables hosted in the live database.
- Database Autoscheduler: This uses Amazon Lambda and Amazon EventBridge to automatically schedule updates to the database to add new crimes. The code used is in the backend section of the database but does not work if you try to run the Python file since its just the code used in the Amazon Lambda file.

## Usage:

Usage section

## Tech Stack

### **Frontend**

- **Framework:** React.js (JavaScript)
- **UI Libraries:**
  - Mantine (for components like Select and DatePicker)
  - Leaflet & React-Leaflet (for interactive maps)
  - Plotly.js (for graphs and data visualization)
- **Styling:** CSS, Mantine custom themes

### **Backend**

- **Framework:** FastAPI (Python) - powers our API and backend services
- **Server:** Uvicorn - runs the backend application
- **Database:** MySQL (hosted on Amazon RDS)
- **Data Processing Libraries:**
  - Pandas, NumPy, SciPy (for data analysis)
  - Scikit-learn, XGBoost (for crime prediction models)
  - Geopy, Polyline (for location-based routing)
  - Pydantic (for data validation)

### **Cloud Services (AWS)**

- **Amazon RDS:** Hosts our live database
- **AWS Lambda:** Handles serverless computing tasks
- **Amazon EventBridge:** Automates database updates on a scheduled basis

### **Deployment & Version Control**

- **Version Control:** Git (GitHub for code management)
- **Deployment:** AWS EC2 (for hosting the application and backend services)
- **Task Automation:** AWS Lambda & EventBridge for automatic data updates

### Data Souce

Data Gathered and used for this project can be found at the following links:

- https://crimecards.dc.gov/
- API JSON Link: https://maps2.dcgis.dc.gov/dcgis/rest/services/FEEDS/MPD/MapServer/8/query?where=1%3D1&outFields=CCN,REPORT_DAT,SHIFT,LATITUDE,LONGITUDE,WARD,NEIGHBORHOOD_CLUSTER,ANC,PSA,VOTING_PRECINCT,METHOD,OFFENSE&outSR=4326&f=json&orderByFields=REPORT_DAT%20DESC&resultRecordCount=1000

## Installation

To run the code there are many dependencies that need to be installed from the terminal. Below are a list of these dependencies. Although we have tried to include all of them, there may be more that we have forgotton to include. If that is the case, your terminal should inform you which dependencies you need to install as you try launching the application.

### NPM Installs

- npm install leaflet react-leaflet
- npm install leaflet
- npm install react-datepicker
- npm install date-fns
- npm install @mantine/core @mantine/dates
- npm install plotly.js-dist

### PIP Installs

- pip install fastapi
- pip install uvicorn[standard]
- pip install mysql-connector-python
- pip install scikit-learn
- pip install xgboost
- pip install numpy
- pip install pandas
- pip install scipy
- pip install geopy
- pip install requests
- pip install polyline
- pip install pydantic
- pip install langchain

### Runing the application

1. Open up two terminals

2. In terminal 1:

   cd backend

   uvicorn main:app --reload

3. In terminal 2:

   npm start

## Usage

Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Project status

As of 12/11/2024 the team will no longer be working on the project. Additionally, the database will be shut down after the final project is graded because we are currently paying to use Amazon RDS resources by having it deployed on the internet. If you desire to fork the project, you should change the credentials to connect to the a new database and use the various functions defined in the crime_database.py file to create and populate the tables by downloading the csv files from where we gathered our data from: https://crimecards.dc.gov/. However, changes the application must not be used for commercial use and must follow our creative license http://creativecommons.org/licenses/by-nc/4.0/.

## Support

Project was developed by Capstone Group 10 - CS 5934. For more information about the project, you can contact our professor ssibdari@vt.edu as team members emails will be deprecated in the near future. Additionally, you can view the repository: https://code.vt.edu/sungpeihsuan/crime-report-web-application

## Roadmap

Roadmap for future improvements to our application:

- We believe that it would be a good idea to use polynomial regression for different crime methods on the Crime Prediction Linear Regression Graph.

- Additionally, on the Saftery Routing Page, we generate a new route for the user that takes into account local crime data over the past 7 days. However, our application does not show the original route generated before taking into account the crime data. This may be a good feature to add to the application.

Additionally linked is our groups Kanban board. Note that this may require a request to access. https://venkata-chaitanya-kanakamedala.atlassian.net/jira/software/projects/CRWA/boards/2

## Contributing

Our team is open to contributions as long as they follow our license: http://creativecommons.org/licenses/by-nc/4.0/

The following is a link to our github repository: https://code.vt.edu/sungpeihsuan/crime-report-web-application

## Authors and acknowledgment

The following project was guided under professor Soheil Sibdari

### Authors:

- Alex Marrero
- Ka Wai Wu
- Kuan-Fu Lin
- Pei-Hsuan Sung (Patty)
- Venkata Chaitanya Kanakamedala

## License

The following is the creative license for our project: http://creativecommons.org/licenses/by-nc/4.0/

This is the full legal code for our license: https://creativecommons.org/licenses/by-nc/4.0/legalcode.en

# More Information About Using React

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

> > > > > > > 0ec4a39 (Initialize project using Create React App)
