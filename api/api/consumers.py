# api/consumers.py
import json
import os
import shutil
from pathlib import Path
from channels.generic.websocket import WebsocketConsumer

UPLOAD_DIR = Path("/tmp/freqsplit")

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
        for file_uuid in self.file_uuid:
            dir_path = os.path.join(UPLOAD_DIR, file_uuid);
            zip_path = os.path.join(UPLOAD_DIR, f"{file_uuid}.zip")
            try:
                if os.path.exists(dir_path):
                    shutil.rmtree(dir_path)
                    
                if os.path.isfile(zip_path):
                    os.remove(zip_path)
            except Exception as e:
                print(f"Error: Failed to cleanup {dir_path} or {zip_path}: {e}")