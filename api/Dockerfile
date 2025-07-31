# ---------------------
# Stage 1: Builder
# ---------------------
FROM python:3.12.7 AS builder

# Install build deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev git curl \
    libffi-dev libssl-dev rustc cargo \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY src/ src/

# Copy metadata and install deps
COPY pyproject.toml requirements.txt ./
RUN pip install --upgrade pip && \
    pip install --prefix=/install --no-cache-dir -e . && \
    pip install --prefix=/install --no-cache-dir -r requirements.txt

# Copy source for build-time extras (if needed)
COPY api/ api/
COPY docker/daphne api/
COPY docker/celery api/
COPY docker/wrapper api/

# ---------------------
# Stage 2: Runtime
# ---------------------
FROM python:3.12.7
# Install runtime system packages (only what’s needed)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev curl libffi-dev libssl-dev wget\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only installed site-packages and app
COPY --from=builder /install /usr/local
COPY api/ api/
COPY src/ src/
COPY LICENSE .
COPY docker/daphne api/
COPY docker/celery api/
COPY docker/wrapper api/

# Set working dir for backend
WORKDIR /app/api

ENV CELERY_BROKER_URL=redis://redis:6379/0

EXPOSE 8000
CMD ./wrapper
