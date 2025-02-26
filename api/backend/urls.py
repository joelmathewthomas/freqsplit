"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api.views import upload_audio
from api.views import normalize_audio
from api.views import trim_audio
from api.views import resample_audio
from api.views import separate_music
from api.views import noisereduce

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/upload', upload_audio, name='upload_audio'),
    path('api/normalize', normalize_audio, name="normalize_audio"),
    path('api/trim', trim_audio, name='trim_audio'),
    path('api/resample', resample_audio, name='resample_audio'),
    path('api/separate', separate_music, name="separate_music"),
    path('api/noisereduce', noisereduce, name="noisreduce")
]
