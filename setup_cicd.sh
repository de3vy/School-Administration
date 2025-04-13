#!/bin/bash

# CI/CD Pipeline Configuration for Progress & Activity Reporting Application
# This script sets up a GitHub Actions workflow for continuous integration and deployment

echo "Setting up CI/CD pipeline for Progress & Activity Reporting Application..."

# Create GitHub Actions directory if it doesn't exist
mkdir -p /home/ubuntu/progress_app/.github/workflows

# Create GitHub Actions workflow file
cat > /home/ubuntu/progress_app/.github/workflows/main.yml << 'EOF'
name: Progress App CI/CD

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:4.4
        ports:
          - 27017:27017

    strategy:
      matrix:
        node-version: [16.x]

    steps:
    - uses: actions/checkout@v2
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v2
      with:
        node-version: ${{ matrix.node-version }}
        
    - name: Backend Tests
      run: |
        cd backend
        npm ci
        npm test
        
    - name: Frontend Tests
      run: |
        cd frontend
        npm ci
        npm test
        
  deploy:
    needs: test
    if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to production server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /path/to/production/app
          git pull
          bash deploy.sh
EOF

echo "CI/CD pipeline configuration created at .github/workflows/main.yml"
echo "Note: You will need to set up the following secrets in your GitHub repository:"
echo "  - HOST: Your production server hostname"
echo "  - USERNAME: SSH username for deployment"
echo "  - SSH_KEY: Private SSH key for deployment"
