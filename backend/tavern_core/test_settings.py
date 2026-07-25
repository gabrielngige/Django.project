"""
Django test settings for 109 Tavern (pytest configuration).
Inherits from main settings and uses the same database environment variables.
"""

from tavern_core import settings as base_settings


for setting_name in dir(base_settings):
    if setting_name.isupper():
        globals()[setting_name] = getattr(base_settings, setting_name)

# Speed up tests by disabling password validation
AUTH_PASSWORD_VALIDATORS = []
