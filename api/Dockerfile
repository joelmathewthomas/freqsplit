FROM python:3.12.7-slim

# Set working directory at project root
WORKDIR /app

# Install system dependencies (for pip + cargo builds)
RUN apt-get update && apt-get install -y \
    build-essential libpq-dev git curl \
    libffi-dev libssl-dev rustc cargo \
    && rm -rf /var/lib/apt/lists/*

# Copy entire repo, except the frontend
COPY . /app
RUN rm -rf client  # optionally ensure client/ is excluded

# Install Python deps from repo root
RUN pip install --upgrade pip setuptools
RUN pip install -e .
RUN pip install -r requirements.txt

EXPOSE 8000

