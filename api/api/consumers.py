# api/consumers.py
import json
from channels.generic.websocket import WebsocketConsumer

class MediaConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.file_uuid = [] # List to store file uuids
        self.send(text_data=json.dumps({
            "message": "Connected to WebSocket server!"
        }))
        
    def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message", "")

        # If message contains a file UUID, store it
        if "file_uuid" in data:
            uuid = data["file_uuid"]
            self.file_uuid.append(uuid)
            self.send(text_data=json.dumps({"response": f"UUID {uuid} stored."}))
        elif message == "ping":
            self.send(text_data=json.dumps({"response": "pong"}))
        else:
            self.send(text_data=json.dumps({"response": f"Received: {message}"}))
            
    def disconnect(self, close_code):
        print("Disconnected from Websocket")
        print("Stored file UUIDs:", self.file_uuid)