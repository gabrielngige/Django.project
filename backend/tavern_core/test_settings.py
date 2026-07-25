"""
Django test settings for 109 Tavern (pytest configuration).
Inherits from main settings and defaults to local Docker PostgreSQL while
allowing CI to override connection details via environment variables.
"""

from decouple import config

from tavern_core.settings import *


def build_test_database_settings():
    return {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='tavern109_db_test'),
        'USER': config('DB_USER', default='tavern109'),
        'PASSWORD': config('DB_PASSWORD', default='tavern109'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5433'),
    }


DATABASES = {
    'default': build_test_database_settings()
}

# Speed up tests by disabling password validation
AUTH_PASSWORD_VALIDATORS = []
