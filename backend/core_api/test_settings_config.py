import json
import os
import subprocess
import sys
from pathlib import Path


def test_settings_respects_database_environment():
    backend_dir = Path(__file__).resolve().parents[1]
    env = os.environ.copy()
    database_env = {
        'DB_NAME': 'ci_db',
        'DB_USER': 'ci_user',
        'DB_PASSWORD': 'ci_password',
        'DB_HOST': 'ci_host',
        'DB_PORT': '6543',
    }
    env.update(database_env)

    result = subprocess.run(
        [
            sys.executable,
            '-c',
            (
                'import json; '
                'import tavern_core.test_settings as settings; '
                "print(json.dumps(settings.DATABASES['default']))"
            ),
        ],
        cwd=backend_dir,
        env=env,
        check=True,
        capture_output=True,
        text=True,
    )

    assert json.loads(result.stdout) == {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': database_env['DB_NAME'],
        'USER': database_env['DB_USER'],
        'PASSWORD': database_env['DB_PASSWORD'],
        'HOST': database_env['DB_HOST'],
        'PORT': database_env['DB_PORT'],
    }
