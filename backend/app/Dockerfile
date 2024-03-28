# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Copy requirements.txt separately to avoid caching issues
COPY requirements.txt /app/requirements.txt

# List contents of the directory for debugging purposes
RUN ls -al

# Install any needed packages specified in requirements.txt
RUN pip install --verbose -r requirements.txt

# Expose port 80 to allow communication from outside the container
EXPOSE 80

# Define environment variable
# ENV SQLALCHEMY_DATABASE_URL=mysql+pymysql://dbuser:dbpassword@mysql:3306/dbname

# Command to run the FastAPI application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "80"]
