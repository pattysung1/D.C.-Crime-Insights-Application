# Use the official Python image for the backend
FROM python:3.11-slim AS backend

# Set the working directory for the backend
WORKDIR /app/backend

# Copy the backend requirements file and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source code
COPY backend .

# Use the official Node.js image for the frontend
FROM node:18 AS frontend

# Set the working directory for the frontend
WORKDIR /app

# Copy the frontend package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the frontend source code
COPY . .

# Build the frontend
RUN npm run build

# Final stage: Combine both backend and frontend
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy the backend from the previous stage
COPY --from=backend /app/backend /app/backend

# Copy the frontend build from the previous stage
COPY --from=frontend /app/build /app/frontend/build

# Install any additional dependencies for the backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Expose the ports for the backend and frontend
EXPOSE 8000

# Command to run the backend server
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]