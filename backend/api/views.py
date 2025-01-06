from django.shortcuts import render
from django.http import JsonResponse
from .tasks import process_uploaded_file
from .forms import UploadFileForm
import os

# Create your views here.
def handle_uploaded_file(f, file_path):
    with open(file_path, 'wb+') as destination:
        for chunk in f.chunks():
            destination.write(chunk)

def upload(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file = form.cleaned_data['file']
            file_path = os.path.join('uploads', file.name)  # Change 'uploads' to your desired directory
            handle_uploaded_file(file, file_path)
            task = process_uploaded_file.delay(file_path)
            return JsonResponse({'task_id': task.id})

    else:
        form = UploadFileForm()
    return render(request, 'upload.html', {'form': form})

from celery.result import AsyncResult

def check_task_status(request, task_id):
    task_result = AsyncResult(task_id)
    return JsonResponse({'status': task_result.status, 'result': task_result.result})
