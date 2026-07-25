"""
Django test settings for 109 Tavern (pytest configuration).
Inherits from main settings and uses the same database environment variables.
Wildcard import is intentional so Django receives the complete base settings module.
"""

from tavern_core.settings import *  # noqa: F403

# Speed up tests by disabling password validation
AUTH_PASSWORD_VALIDATORS = []
