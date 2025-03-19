# api/routing.py
from django.urls import path
from . import consumers

websocket_urlpatterns= [
    path("ws/media/", consumers.MediaConsumer.as_asgi()),
]