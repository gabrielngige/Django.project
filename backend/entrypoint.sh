#!/bin/sh
set -e

# Run migrations
python manage.py migrate

# Create superuser if it doesn't exist
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='gabriel').exists():
    User.objects.create_superuser('gabriel', 'gabriel@example.com', '40286538')
    print('Superuser gabriel created')
else:
    print('Superuser gabriel already exists')
END

# Start gunicorn
exec gunicorn --bind 0.0.0.0:${PORT:-8000} tavern_core.wsgi:application --workers 3
