INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "django_filters",
    "corsheaders",
    "debug_toolbar",
    "drf_spectacular",
    "drf_spectacular_sidecar",
    # Local
    "apps.authentication.apps.AuthenticationConfig",
    "apps.parameter.apps.ParameterConfig",
    "apps.lawsuit.apps.LawsuitConfig",
    "apps.finance.apps.FinanceConfig",
    "apps.announcement.apps.AnnouncementConfig",
    "apps.notification.apps.NotificationConfig",
    "apps.escavador.apps.EscavadorConfig",
]
