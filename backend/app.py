from flask import Flask, request
from flask_cors import CORS
from flask_restful import Resource, Api
from google.cloud import firestore

from resources.classes import ClassResource

app = Flask(__name__)
CORS(app)
api = Api(app)

# Initialize Firestore client (make sure GOOGLE_APPLICATION_CREDENTIALS is set)
db = firestore.Client()

api.add_resource(ClassResource, '/api/classes')

if __name__ == '__main__':
    app.run(port=4000, debug=True)