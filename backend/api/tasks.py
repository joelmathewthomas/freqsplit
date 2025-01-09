from __future__ import absolute_import, unicode_literals
from celery import shared_task
from src.input.file_reader import read_audio #export PYTHONPATH="/home/karthikeyan/code/MainProject/freq-split-enhance:$PYTHONPATH" for exporting the module 

import time

@shared_task
def process_uploaded_file(file_path):
    # Simulate long-running task
    read_audio(file_path=file_path)
    return 'File processed'
