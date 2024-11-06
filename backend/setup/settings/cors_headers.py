import os
from utils.env import get_env_variable, parse_comma_set_str_to_list

CORS_ALLOWED_ORIGINS: list[str] = parse_comma_set_str_to_list(
    get_env_variable("CORS_ALLOWED_ORIGINS")
)

CORS_ALLOW_ALL_ORIGINS: bool = (
    True if os.environ.get("CORS_ALLOW_ALL_ORIGINS", 1) == "1" else False
)
