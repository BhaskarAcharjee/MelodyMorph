# Stage 1: Build stage
FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run bundle

# Stage 2: Production stage
FROM python:3.10-slim as production-stage
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --from=build-stage /app /app
EXPOSE 5000

# Start Gunicorn with your Flask app
CMD ["gunicorn", "app:app", "-b", "0.0.0.0:5000"]
