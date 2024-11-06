from utils.env import get_env_variable


EMAIL_NOTIFICATIONS = (
    True if get_env_variable("EMAIL_NOTIFICATIONS", "0") == "1" else False
)
EMAIL_BACKEND = get_env_variable("EMAIL_BACKEND")
EMAIL_HOST = get_env_variable("EMAIL_HOST")
EMAIL_HOST_USER = get_env_variable("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = get_env_variable("EMAIL_HOST_PASSWORD")
EMAIL_PORT = get_env_variable("EMAIL_PORT")
EMAIL_USE_TLS = True if get_env_variable("EMAIL_USE_TLS", "1") == "1" else False
EMAIL_USE_SSL = True if get_env_variable("EMAIL_USE_SSL", "0") == "1" else False
EMAIL_SUBJECT_PREFIX = get_env_variable("EMAIL_SUBJECT_PREFIX")
EMAIL_USE_LOCALTIME = (
    True if get_env_variable("EMAIL_USE_LOCALTIME", "1") == "1" else False
)
