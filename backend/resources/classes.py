from flask_restful import Resource
from flask import request
from google.cloud import firestore

db = firestore.Client()

class ClassResource(Resource):
    def get(self):
        codes = request.args.getlist('codes')

        if not codes:
            codes_str = request.args.get('codes')
            if codes_str:
                codes = [c.strip() for c in codes_str.split(',') if c.strip()]

        classes_ref = db.collection('classes')
        results = []

        if codes:
            # Firestore 'in' query supports up to 10 values
            query = classes_ref.where('code', 'in', codes[:10])
            docs = query.stream()
            results = [{**doc.to_dict(), 'id': doc.id} for doc in docs]
        else:
            docs = classes_ref.stream()
            results = [{**doc.to_dict(), 'id': doc.id} for doc in docs]

        return {'classes': results}