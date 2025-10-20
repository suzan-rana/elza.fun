# Database Management

This document explains how to manage the Elza database using Docker Compose.

## Quick Start

```bash
# Start database
./scripts/db-start.sh

# Check status
./scripts/db-status.sh

# Stop database
./scripts/db-stop.sh
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `./scripts/db-start.sh` | Start PostgreSQL database and pgAdmin |
| `./scripts/db-stop.sh` | Stop database services |
| `./scripts/db-reset.sh` | Reset database (⚠️ deletes all data) |
| `./scripts/db-logs.sh` | View database logs |
| `./scripts/db-status.sh` | Check database status |

## Database Configuration

* **Host**: localhost
* **Port**: 5433
* **Database**: elza\_db
* **Username**: elza\_user
* **Password**: elza\_password

## pgAdmin (Optional)

A web-based PostgreSQL administration tool is available at:

* **URL**: http://localhost:8080
* **Email**: admin@elza.fun
* **Password**: admin123

## Development Workflow

1. **Start the database**:
   ```bash
   ./scripts/db-start.sh
   ```

2. **Start your NestJS server locally**:
   ```bash
   npm run start:dev
   ```

3. **Check database status**:
   ```bash
   ./scripts/db-status.sh
   ```

4. **View logs if needed**:
   ```bash
   ./scripts/db-logs.sh
   ```

5. **Stop when done**:
   ```bash
   ./scripts/db-stop.sh
   ```

## Troubleshooting

### Database won't start

* Check if Docker is running: `docker info`
* Check if port 5433 is available: `lsof -i :5433`
* View logs: `./scripts/db-logs.sh`

### Connection refused

* Ensure database is healthy: `./scripts/db-status.sh`
* Check if your NestJS app is using port 5433
* Verify database credentials in your `.env` file

### Reset everything

```bash
./scripts/db-reset.sh
./scripts/db-start.sh
```

## Environment Variables

Create a `.env` file in the server directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=elza_user
DB_PASSWORD=elza_password
DB_DATABASE=elza_db

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Node Environment
NODE_ENV=development
```

## Data Persistence

Database data is persisted in Docker volumes:

* `postgres_data`: PostgreSQL data files
* `pgadmin_data`: pgAdmin configuration

To completely remove all data:

```bash
./scripts/db-reset.sh
```

## Production Notes

For production deployment:

1. Change default passwords
2. Use environment variables for sensitive data
3. Configure proper backup strategies
4. Use a managed database service (AWS RDS, Google Cloud SQL, etc.)
