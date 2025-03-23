# Dockerfile
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Run as non-root user for security
RUN adduser --disabled-password --gecos '' appuser
USER appuser

# Run gunicorn in production, comment out for development
# CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]