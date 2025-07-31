FROM python:3.12.7

WORKDIR /app

# Copy necessary files
COPY LICENSE .
COPY pyproject.toml .
COPY requirements.txt .
COPY api/ api/
COPY src/ src/
COPY daphne.sh api/
COPY celery.sh api/
COPY wrapper.sh api/

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential libpq-dev git curl \
    libffi-dev libssl-dev rustc cargo \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -e . && \
    pip install --no-cache-dir -r requirements.txt

# Ensure scripts are executable
RUN chmod +x ./api/*.sh

WORKDIR /app/api
ENV CELERY_BROKER_URL=redis://redis:6379/0

EXPOSE 8000
CMD ./wrapper.sh

