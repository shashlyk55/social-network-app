#!/bin/bash
set -e

echo "Starting database initialization..."

# Переменные из окружения или значения по умолчанию
DB_NAME=${POSTGRES_DB}
DB_USER=${POSTGRES_USER}
DB_PASSWORD=${POSTGRES_PASSWORD}
DB_SCHEMA=${POSTGRES_SCHEMA}

echo "Creating database: $DB_NAME"
echo "Creating user: $DB_USER"
# echo "Using schema: $DB_SCHEMA"

# Создаем пользователя
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
    CREATE DATABASE $DB_NAME;
    GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOSQL

echo "User and database created successfully"

# Создаем схемы и настраиваем права
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
    -- Создаем схемы
    CREATE SCHEMA IF NOT EXISTS core;
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE SCHEMA IF NOT EXISTS notification;
    
    -- Даем права на схемы
    GRANT ALL ON SCHEMA core TO $DB_USER;
    GRANT ALL ON SCHEMA auth TO $DB_USER;
    GRANT ALL ON SCHEMA notification TO $DB_USER;
    
    -- Настраиваем default privileges для таблиц
    ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT ALL ON TABLES TO $DB_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON TABLES TO $DB_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA notification GRANT ALL ON TABLES TO $DB_USER;
    
    -- Настраиваем default privileges для последовательностей
    ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT ALL ON SEQUENCES TO $DB_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA auth GRANT ALL ON SEQUENCES TO $DB_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA notification GRANT ALL ON SEQUENCES TO $DB_USER;
        
    -- Проверяем создание
    SELECT 'Database ' || '$DB_NAME' || ' created successfully!' AS status;
    SELECT 'User: ' || '$DB_USER' AS user_info;
EOSQL

echo "Database initialization completed successfully!"