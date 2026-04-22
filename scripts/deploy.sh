#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_ID="runmind-483617"
REGION="us-central1"
SERVICE_NAME="runmind-app"

# Production environment variables
PROD_API_URL="https://runmid-api-620849332552.us-central1.run.app"
PROD_AUTH_API_URL="https://runmind-cara-cracha-620849332552.southamerica-east1.run.app"
PROD_RUNMID_API_URL="https://runmid-api-620849332552.us-central1.run.app"
PROD_CHAT_API_URL="https://runmind-chat-agent-620849332552.southamerica-east1.run.app"
PROD_STRAVA_CLIENT_ID="165299"

# Local ports
LOCAL_PORT=3000

print_usage() {
    echo -e "${YELLOW}Usage: $0 [local|prod]${NC}"
    echo ""
    echo "  local  - Run development server locally"
    echo "  prod   - Deploy to Google Cloud Run"
    echo ""
}

kill_port() {
    local port=$1
    echo -e "${YELLOW}Checking for processes on port $port...${NC}"

    # Find and kill processes on the port
    local pids=$(lsof -ti:$port 2>/dev/null || true)

    if [ -n "$pids" ]; then
        echo -e "${YELLOW}Killing processes on port $port: $pids${NC}"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 1
        echo -e "${GREEN}Port $port is now free${NC}"
    else
        echo -e "${GREEN}Port $port is already free${NC}"
    fi
}

run_local() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Starting Local Development Server${NC}"
    echo -e "${GREEN}========================================${NC}"

    # Kill any process on port 3000
    kill_port $LOCAL_PORT

    # Change to project directory
    cd "$(dirname "$0")/.."

    echo -e "${YELLOW}Starting npm run dev...${NC}"
    echo ""

    # Run development server
    npm run dev
}

deploy_prod() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Deploying to Production (Cloud Run)${NC}"
    echo -e "${GREEN}========================================${NC}"

    # Change to project directory
    cd "$(dirname "$0")/.."

    echo -e "${YELLOW}Project: $PROJECT_ID${NC}"
    echo -e "${YELLOW}Region: $REGION${NC}"
    echo -e "${YELLOW}Service: $SERVICE_NAME${NC}"
    echo ""

    # Build and deploy using cloudbuild.yaml
    echo -e "${YELLOW}Building and deploying...${NC}"

    gcloud builds submit \
        --project "$PROJECT_ID" \
        --config cloudbuild.yaml

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Deployment Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"

    # Show service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --project $PROJECT_ID \
        --region $REGION \
        --format 'value(status.url)' 2>/dev/null || echo "")

    if [ -n "$SERVICE_URL" ]; then
        echo -e "${GREEN}Service URL: $SERVICE_URL${NC}"
    fi
}

# Main
case "${1:-}" in
    local)
        run_local
        ;;
    prod)
        deploy_prod
        ;;
    *)
        print_usage
        exit 1
        ;;
esac
