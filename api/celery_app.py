import os
import sys
from celery import Celery

# Automatically set environment variables in celery_app.py

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Add the project directory to sys.path (similar to the manual PYTHONPATH)
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_root)

app = Celery('backend')

# Load configuration from Django settings, using the CELERY namespace.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Autodiscover tasks from installed apps.
app.autodiscover_tasks()
