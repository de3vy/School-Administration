#!/bin/bash

# Deployment script for Progress & Activity Reporting Application
# This script automates the deployment process for both backend and frontend

echo "Starting deployment of Progress & Activity Reporting Application..."

# Configuration variables
APP_NAME="progress_app"
BACKEND_DIR="/home/ubuntu/progress_app/backend"
FRONTEND_DIR="/home/ubuntu/progress_app/frontend"
DEPLOY_LOG="/home/ubuntu/progress_app/deployment.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Create log file
echo "=== Deployment started at $TIMESTAMP ===" > $DEPLOY_LOG

# Function to log messages
log_message() {
  echo "$1"
  echo "$(date +"%Y-%m-%d %H:%M:%S") - $1" >> $DEPLOY_LOG
}

# Check if directories exist
if [ ! -d "$BACKEND_DIR" ]; then
  log_message "ERROR: Backend directory not found at $BACKEND_DIR"
  exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
  log_message "ERROR: Frontend directory not found at $FRONTEND_DIR"
  exit 1
fi

# Deploy Backend
log_message "Deploying backend..."

cd $BACKEND_DIR

# Install dependencies
log_message "Installing backend dependencies..."
npm install --production >> $DEPLOY_LOG 2>&1
if [ $? -ne 0 ]; then
  log_message "ERROR: Failed to install backend dependencies"
  exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
  log_message "WARNING: .env file not found, creating from template"
  cp .env.example .env
fi

# Run database migrations if needed
# log_message "Running database migrations..."
# npm run migrate >> $DEPLOY_LOG 2>&1

# Deploy Frontend
log_message "Deploying frontend..."

cd $FRONTEND_DIR

# Install dependencies
log_message "Installing frontend dependencies..."
npm install --production >> $DEPLOY_LOG 2>&1
if [ $? -ne 0 ]; then
  log_message "ERROR: Failed to install frontend dependencies"
  exit 1
fi

# Build frontend
log_message "Building frontend..."
npm run build >> $DEPLOY_LOG 2>&1
if [ $? -ne 0 ]; then
  log_message "ERROR: Failed to build frontend"
  exit 1
fi

# Start or restart services
log_message "Starting services..."

# Start backend server
cd $BACKEND_DIR
pm2 delete $APP_NAME-backend 2>/dev/null
pm2 start server.js --name $APP_NAME-backend >> $DEPLOY_LOG 2>&1
if [ $? -ne 0 ]; then
  log_message "ERROR: Failed to start backend server"
  exit 1
fi

# Serve frontend (assuming we're using a static file server)
cd $FRONTEND_DIR
pm2 delete $APP_NAME-frontend 2>/dev/null
pm2 serve build 3000 --name $APP_NAME-frontend --spa >> $DEPLOY_LOG 2>&1
if [ $? -ne 0 ]; then
  log_message "ERROR: Failed to start frontend server"
  exit 1
fi

# Save PM2 configuration
pm2 save >> $DEPLOY_LOG 2>&1

log_message "Deployment completed successfully!"
log_message "Backend running at http://localhost:5000"
log_message "Frontend running at http://localhost:3000"

echo "=== Deployment completed at $(date +"%Y-%m-%d %H:%M:%S") ===" >> $DEPLOY_LOG
