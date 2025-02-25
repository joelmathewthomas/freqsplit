from celery import shared_task

@shared_task
def save_uploaded_file(file_path, file_content):
    """Save uploaded file asynchronously"""
    with open(file_path, 'wb') as destination:
        destination.write(file_content)