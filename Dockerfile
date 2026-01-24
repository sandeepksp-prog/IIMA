# Use Python 3.10
FROM python:3.10

# Set working directory to root
WORKDIR /app

# Copy requirements
COPY backend/requirements.txt /app/backend/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy the entire project
COPY . /app

# Create a non-root user (Required for Hugging Face Spaces Security)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Expose the standard HF Spaces port
EXPOSE 7860

# Run the app on port 7860
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
