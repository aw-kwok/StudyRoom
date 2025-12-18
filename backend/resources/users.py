from flask_restful import Resource
from flask import request
from google.cloud import firestore
from datetime import datetime
import random

db = firestore.Client()

def get_random_status():
    """Randomly return 'online', 'away', or 'offline'"""
    return random.choice(['online', 'away', 'offline'])

class UserInviteResource(Resource):
    def patch(self, username):
        """Update invite status for a user"""
        try:
            data = request.get_json()
            invited = data.get('invited', False)
            
            # Find user document by name field in users collection
            users_ref = db.collection('users')
            query = users_ref.where('name', '==', username).limit(1)
            docs = list(query.stream())
            
            if not docs:
                # User not found, return error
                return {'error': f'User "{username}" not found'}, 404
            
            # Update the user document
            user_doc = docs[0]
            user_doc.reference.update({
                'invited': invited,
                'invitedAt': firestore.SERVER_TIMESTAMP if invited else None
            })
            
            return {'success': True, 'invited': invited, 'username': username}, 200
        except Exception as e:
            import traceback
            error_msg = str(e)
            traceback.print_exc()
            return {'error': error_msg, 'details': traceback.format_exc()}, 500

class DirectMessageResource(Resource):
    def get(self, username):
        """Get or create a direct message conversation with a user"""
        try:
            current_user = 'John Doe'  # Default current user
            
            # Create a unique DM ID (sorted usernames to ensure consistency)
            participants = sorted([current_user, username])
            dm_id = f"dm_{participants[0]}_{participants[1]}".replace(' ', '_')
            
            # Check if DM conversation exists
            chats_ref = db.collection('conversations')
            dm_doc = chats_ref.document(dm_id).get()
            
            if not dm_doc.exists:
                # Create new DM conversation with randomized status
                random_status = get_random_status()
                dm_data = {
                    'name': username,  # Display name is the other user's name
                    'isGroup': False,
                    'isDM': True,
                    'participants': [current_user, username],
                    'userStatus': random_status,  # Random status: online, away, or offline
                    'onlineCount': 0,
                    'unread': False,
                    'unreadCount': 0,
                    'chats': [],
                    'createdAt': firestore.SERVER_TIMESTAMP
                }
                chats_ref.document(dm_id).set(dm_data)
                dm_data['id'] = dm_id
                dm_data['preview'] = 'No messages yet'
                dm_data['time'] = ''
                return {'chat': dm_data}, 201
            
            # Return existing DM conversation
            dm_data = dm_doc.to_dict()
            dm_data['id'] = dm_id
            
            # Ensure userStatus exists (for older conversations that might not have it)
            if 'userStatus' not in dm_data or not dm_data['userStatus']:
                random_status = get_random_status()
                dm_data['userStatus'] = random_status
                # Update the document with the status
                dm_doc.reference.update({'userStatus': random_status})
            
            # Get last message for preview
            chats_array = dm_data.get('chats', [])
            preview = 'No messages yet'
            last_time = None
            
            if chats_array and len(chats_array) > 0:
                try:
                    def get_timestamp_value(msg):
                        ts = msg.get('timestamp')
                        if ts is None:
                            return 0
                        if hasattr(ts, 'timestamp'):
                            return ts.timestamp()
                        elif hasattr(ts, 'seconds'):
                            return ts.seconds
                        elif isinstance(ts, datetime):
                            return ts.timestamp()
                        return 0
                    
                    last_message = sorted(chats_array, key=get_timestamp_value, reverse=True)[0]
                    preview = last_message.get('text', '[Image]')
                    last_time = last_message.get('timestamp')
                except Exception:
                    last_message = chats_array[-1] if chats_array else None
                    if last_message:
                        preview = last_message.get('text', '[Image]')
                        last_time = last_message.get('timestamp')
            
            dm_data['preview'] = preview
            
            # Format timestamp if available
            from resources.chats import format_timestamp
            if last_time:
                dm_data['time'] = format_timestamp(last_time)
                try:
                    if hasattr(last_time, 'timestamp'):
                        dm_data['_lastMessageTimestamp'] = last_time.timestamp()
                    elif hasattr(last_time, 'seconds'):
                        dm_data['_lastMessageTimestamp'] = last_time.seconds
                    elif isinstance(last_time, datetime):
                        dm_data['_lastMessageTimestamp'] = last_time.timestamp()
                except:
                    pass
            else:
                dm_data['time'] = ''
            
            # Clean Firestore objects for JSON serialization
            from resources.chats import clean_firestore_data
            cleaned_data = clean_firestore_data(dm_data)
            
            return {'chat': cleaned_data}, 200
        except Exception as e:
            import traceback
            error_msg = str(e)
            traceback.print_exc()
            return {'error': error_msg, 'details': traceback.format_exc()}, 500
