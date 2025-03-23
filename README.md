# Intervention Management System

A system for managing equipment interventions and maintenance.

## Development with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git

### Setup

1. Clone the repository:
git clone https://github.com/sirine-seg/Projet_2cp.git cd Projet_2cp
2. Create a .env file based on the example:
cp .env.example .env

3. Build and start the Docker containers:
docker-compose up -d
4. Apply migrations:
docker-compose exec web python manage.py migrate
5. Load initial data:
docker-compose run --rm setup
6. Create a superuser (optional):
docker-compose exec web python manage.py createsuperuser
7. Access the application:
- API: http://localhost:8000/api/
- Admin interface: http://localhost:8000/admin/

### Test Accounts

- Admin: nm_djabri@esi.dz / admin123
- Technician: nm_bekoul@esi.dz / tech123
- Personnel: personnel@test.com / personnel123

### Development Workflow

1. Make changes to the code
2. Test your changes locally
3. Commit and push your changes
4. Create a pull request



