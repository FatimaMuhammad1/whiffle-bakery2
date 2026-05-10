FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Back4App requires the app to listen on the port defined by the $PORT env var or default to 8080)
EXPOSE 8080

# Add a shell script to resolve $PORT and run uvicorn
RUN echo '#!/bin/sh' > /start.sh \
    && echo 'PORT=${PORT:-8080}' >> /start.sh \
    && echo 'exec uvicorn app.main:app --host 0.0.0.0 --port $PORT' >> /start.sh \
    && chmod +x /start.sh

# Use the shell script as the entrypoint
CMD ["/start.sh"]
