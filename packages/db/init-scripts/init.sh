#!/bin/bash
set -e

echo "Starting database initialization..."

# Переменные из окружения
DB_NAME=${POSTGRES_DB}
DB_USER=${POSTGRES_USER}
DB_PASSWORD=${POSTGRES_PASSWORD}
DB_SCHEMA=${POSTGRES_SCHEMA}

echo "Creating database: $DB_NAME"
echo "Creating user: $DB_USER"

# ПОДКЛЮЧАЕМСЯ КАК POSTGRES (суперпользователь), а не как наш новый пользователь!
psql -v ON_ERROR_STOP=1 --username $DB_USER <<-EOSQL
    --CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    CREATE DATABASE $DB_NAME;
    GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOSQL

echo "User and database created successfully"

# Теперь создаем схемы, подключаясь как postgres к новой базе
psql -v ON_ERROR_STOP=1 --username $DB_USER --dbname "$DB_NAME" <<-EOSQL
    -- Создаем схемы
    CREATE SCHEMA IF NOT EXISTS main;
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE SCHEMA IF NOT EXISTS notification;
    
    -- Даем права на схемы
    GRANT ALL ON SCHEMA main TO $DB_USER;
    GRANT ALL ON SCHEMA auth TO $DB_USER;
    GRANT ALL ON SCHEMA notification TO $DB_USER;
    
    -- Настраиваем default privileges для таблиц
    ALTER DEFAULT PRIVILEGES IN SCHEMA main GRANT ALL ON TABLES TO $DB_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO $DB_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA notification GRANT ALL ON TABLES TO $DB_USER;
    
    -- Настраиваем default privileges для последовательностей
    ALTER DEFAULT PRIVILEGES IN SCHEMA main GRANT ALL ON SEQUENCES TO $DB_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON SEQUENCES TO $DB_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA notification GRANT ALL ON SEQUENCES TO $DB_USER;
    
    -- Устанавливаем search_path
    ALTER USER $DB_USER SET search_path TO core, main, notification, public;
    
    -- Проверяем создание
    SELECT 'Database ' || '$DB_NAME' || ' created successfully!' AS status;
    SELECT 'User: ' || '$DB_USER' AS user_info;
EOSQL

echo "Database initialization completed successfully!"