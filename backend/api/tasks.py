from __future__ import absolute_import, unicode_literals
from celery import shared_task
import time

@shared_task
def process_uploaded_file(file_path):
    # Simulate long-running task
    time.sleep(300)  # Replace with actual file processing logic
    return 'File processed'
