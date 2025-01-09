from celery import Celery

app = Celery('backend')

# Load configuration from Django settings, using the CELERY namespace.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Autodiscover tasks from installed apps.
app.autodiscover_tasks()
