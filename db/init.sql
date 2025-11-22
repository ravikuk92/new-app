-- init.sql: create sample table and a row used by the backend
CREATE DATABASE appdb;
\connect appdb
CREATE TABLE IF NOT EXISTS sample (
  id serial PRIMARY KEY,
  message text NOT NULL
);
INSERT INTO sample (message) VALUES ('Hello from Postgres!');
