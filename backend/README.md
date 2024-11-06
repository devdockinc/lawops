# LawOps Backend
This is the private backend for the LawOps project. Django is used to create the backend with Django Rest Framework to create the API.

## Running

1. Pull the repository
2. If you don't already have a virtual environment, create one with `python3 -m venv venv` (Python 3.11+)
3. Activate the virtual environment with `. venv/bin/activate`
4. Copy the `.env.example` file to `.env` and fill in the necessary values
5. Install the requirements with `pip install -r requirements.txt`
6. Make migrations with `python manage.py makemigrations`
7. Migrate the database with `python manage.py migrate`
8. Run the server with `python manage.py runserver`
