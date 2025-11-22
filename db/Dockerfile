FROM postgres:15-alpine
# Copy initialization SQL into the image so the DB can be created with sample data when the container is run
COPY init.sql /docker-entrypoint-initdb.d/
