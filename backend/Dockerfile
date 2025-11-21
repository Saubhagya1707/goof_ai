FROM python:3.11-slim AS base

WORKDIR /app

# Runtime environment variables (will be replaced by --env-file)
ENV DB_USER=""
ENV DB_PASSWORD=""
ENV DB_HOST=""
ENV DB_PORT=""
ENV DB_NAME=""

# Install Java (required for Flyway ARM support)
RUN apt-get update && apt-get install -y curl unzip openjdk-21-jre


# Install Flyway (Java version = architecture independent)
RUN curl -L https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/10.17.0/flyway-commandline-10.17.0.tar.gz -o flyway.tar.gz \
    && tar -xzf flyway.tar.gz \
    && mv flyway-10.17.0 /opt/flyway \
    && ln -s /opt/flyway/flyway /usr/local/bin/flyway \
    && rm flyway.tar.gz

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--watch"]
