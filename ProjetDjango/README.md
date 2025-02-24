# Authentification
Authentifiation backend using Django REST Framwork

## Setup Instructions

### Prerequisites

- Python 3.x
- PostgreSQL

### Backend Setup

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd ProjetDjango
    ```

2. Create a virtual environment and activate it:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```


3. Install the dependencies:
    ```sh
    pip install -r requirements.txt
    ```

4. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    SECRET_KEY=your_secret_key
    DEBUG=True
    DATABASE_NAME=sirineDB
    DATABASE_USER=postgres
    DATABASE_PASSWORD=31454602
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    ```

5. Run the migrations:
    ```sh
    python manage.py migrate
    ```

6. Create a superuser:
    ```sh
    python manage.py createsuperuser
    ```

7. Start the development server:
    ```sh
    python manage.py runserver
    ```
8. **Accessing API Documentation**
* This project uses drf-yasg to generate API documentation. After setting up and running the Django       development server, you can access the API documentation at the following URLs:

* Swagger UI: Provides an interactive API documentation interface.

* URL: http://127.0.0.1:8000/swagger/
* ReDoc: Provides a more detailed and customizable API documentation interface.

* URL: http://127.0.0.1:8000/redoc/
* Swagger JSON/YAML: Provides the raw Swagger/OpenAPI specification in JSON or YAML format.

* URL: http://127.0.0.1:8000/swagger.json
* URL: http://127.0.0.1:8000/swagger.yaml
* These endpoints allow you to explore and interact with the API directly from your browser.