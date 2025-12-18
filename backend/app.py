from flask import Flask, request
from flask_cors import CORS
from flask_restful import Resource, Api
from google.cloud import firestore

from resources.classes import ClassResource
from resources.chats import ChatResource, ClassChatResource
from resources.messages import MessageResource, MessageLikeResource
from resources.users import UserInviteResource, DirectMessageResource

app = Flask(__name__)
# Configure CORS to allow all requests from frontend (for development)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"], 
     methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     supports_credentials=True)
api = Api(app)

# Initialize Firestore client (make sure GOOGLE_APPLICATION_CREDENTIALS is set)
db = firestore.Client()

api.add_resource(ClassResource, '/api/classes')
api.add_resource(ChatResource, '/api/chats')
api.add_resource(ClassChatResource, '/api/chats/class/<string:class_id>', endpoint='class_chat_get')
api.add_resource(ClassChatResource, '/api/chats/class/<string:class_id>/join', endpoint='class_chat_post')
api.add_resource(MessageResource, '/api/chats/<string:chat_id>/messages')
api.add_resource(MessageLikeResource, '/api/chats/<string:chat_id>/messages/<string:message_id>/like')
api.add_resource(UserInviteResource, '/api/users/<string:username>/invite')
api.add_resource(DirectMessageResource, '/api/chats/dm/<string:username>')

if __name__ == '__main__':
    app.run(port=4000, debug=True)