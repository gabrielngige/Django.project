"""
Django test settings for 109 Tavern (pytest configuration).
Inherits from main settings but overrides database to use local Docker PostgreSQL.
"""

from tavern_core.settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'tavern109_db_test',
        'USER': 'tavern109',
        'PASSWORD': 'tavern109',
        'HOST': 'localhost',
        'PORT': '5433',
    }
}

# Speed up tests by disabling password validation
AUTH_PASSWORD_VALIDATORS = []

