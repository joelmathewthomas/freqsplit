# api/routing.py
from django.urls import path
from . import consumers

websocket_urlpatterns= [
    path("ws/freqsplit/", consumers.MediaConsumer.as_asgi()),
]