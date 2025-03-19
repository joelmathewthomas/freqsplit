# api/consumers.py
import json
from channels.generic.websocket import WebsocketConsumer

class MediaConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.send(text_data=json.dumps({
            "message": "Connected to WebSocket server!"
        }))
        
    def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message", "")
        
        if message == "ping":
            self.send(text_data=json.dumps({"response": "pong"}))
        else:
            self.send(text_data=json.dumps({"response": f"Received: {message}"}))
            
    def disconnect(self, close_code):
        print("Disconnected from Websocket")