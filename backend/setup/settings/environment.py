import os
from pathlib import Path

from utils.env import get_env_variable, parse_comma_set_str_to_list

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY", "INSECURE")  # noqa

# SECURITY WARNING: don"t run with debug turned on in production!
DEBUG = True if os.environ.get("DEBUG", 1) == "1" else False

ALLOWED_HOSTS: list[str] = parse_comma_set_str_to_list(
    get_env_variable("ALLOWED_HOSTS")
)

CSRF_TRUSTED_ORIGINS: list[str] = parse_comma_set_str_to_list(
    get_env_variable("CSRF_TRUSTED_ORIGINS")
)

ROOT_URLCONF = "setup.urls"

WSGI_APPLICATION = "setup.wsgi.application"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "authentication.User"
