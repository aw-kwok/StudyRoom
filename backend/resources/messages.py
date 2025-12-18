from flask_restful import Resource
from flask import request
from google.cloud import firestore
from datetime import datetime
try:
    from zoneinfo import ZoneInfo
except ImportError:
    # Fallback for Python < 3.9
    try:
        import pytz
        def ZoneInfo(tz):
            return pytz.timezone(tz)
    except ImportError:
        # If neither available, use UTC offset (not ideal but works)
        from datetime import timezone, timedelta
        def ZoneInfo(tz):
            if 'New_York' in tz or 'Eastern' in tz:
                return timezone(timedelta(hours=-5))  # EST offset
            return timezone.utc

db = firestore.Client()

# Eastern Time timezone
EASTERN = ZoneInfo('America/New_York')

def get_eastern_time():
    """Get current time in Eastern Time"""
    return datetime.now(EASTERN)

def clean_firestore_data(data):
    """Convert Firestore objects to JSON-serializable format"""
    if isinstance(data, dict):
        return {k: clean_firestore_data(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [clean_firestore_data(item) for item in data]
    elif hasattr(data, 'timestamp'):
        # Firestore Timestamp - convert to ISO string
        try:
            return data.to_datetime().isoformat()
        except:
            return str(data)
    elif hasattr(data, 'seconds'):
        # Firestore Timestamp with seconds
        try:
            dt = datetime.fromtimestamp(data.seconds + data.nanos / 1e9)
            return dt.isoformat()
        except:
            return str(data)
    elif isinstance(data, datetime):
        return data.isoformat()
    else:
        return data

class MessageResource(Resource):
    def get(self, chat_id):
        """Get all messages for a chat"""
        try:
            # Verify chat exists (chat_id is the course name)
            chat_doc = db.collection('conversations').document(chat_id).get()
            if not chat_doc.exists:
                return {'error': 'Chat not found'}, 404
            
            chat_data = chat_doc.to_dict()
            chats_array = chat_data.get('chats', [])
            
            # Handle empty array
            if not chats_array or len(chats_array) == 0:
                return {'messages': []}, 200
            
            # Sort messages by timestamp
            def get_timestamp_value(msg):
                ts = msg.get('timestamp')
                if ts is None:
                    return 0
                # Handle Firestore Timestamp objects
                if hasattr(ts, 'timestamp'):
                    return ts.timestamp()
                elif hasattr(ts, 'seconds'):
                    return ts.seconds
                elif isinstance(ts, datetime):
                    return ts.timestamp()
                return 0
            
            messages = sorted(chats_array, key=get_timestamp_value)
            
            # Process messages to add showHeader logic
            prev_sender = None
            prev_timestamp = None
            processed_messages = []
            
            for idx, msg_data in enumerate(messages):
                # Add index-based ID for frontend use
                msg_data['id'] = idx
                
                # Determine if we should show header
                # Show header if sender changed or if it's been more than 5 minutes
                timestamp = msg_data.get('timestamp')
                sender = msg_data.get('sender', '')
                
                show_header = False
                # Treat "John Doe" as current user (same as "me") - no header
                if sender != 'me' and sender != 'John Doe':
                    if prev_sender != sender:
                        show_header = True
                    elif prev_timestamp and timestamp:
                        # Check if more than 5 minutes passed
                        try:
                            if hasattr(timestamp, 'to_datetime') and hasattr(prev_timestamp, 'to_datetime'):
                                # Firestore Timestamp objects
                                ts1 = timestamp.to_datetime()
                                ts2 = prev_timestamp.to_datetime()
                                diff_seconds = (ts1 - ts2).total_seconds()
                                if diff_seconds > 300:  # 5 minutes
                                    show_header = True
                            elif hasattr(timestamp, 'timestamp') and hasattr(prev_timestamp, 'timestamp'):
                                diff_seconds = timestamp.timestamp() - prev_timestamp.timestamp()
                                if diff_seconds > 300:  # 5 minutes
                                    show_header = True
                            elif isinstance(timestamp, datetime) and isinstance(prev_timestamp, datetime):
                                diff_seconds = (timestamp - prev_timestamp).total_seconds()
                                if diff_seconds > 300:
                                    show_header = True
                        except Exception:
                            # If timestamp comparison fails, show header to be safe
                            show_header = True
                
                msg_data['showHeader'] = show_header
                msg_data.setdefault('liked', False)
                msg_data.setdefault('status', 'online')
                
                processed_messages.append(msg_data)
                
                prev_sender = sender
                prev_timestamp = timestamp
            
            # Clean Firestore objects for JSON serialization
            cleaned_messages = clean_firestore_data(processed_messages)
            
            return {'messages': cleaned_messages}, 200
        except Exception as e:
            return {'error': str(e)}, 500
    
    def post(self, chat_id):
        """Send a message to a chat"""
        try:
            data = request.get_json()
            if not data:
                return {'error': 'No data provided'}, 400
            
            # Verify chat exists (chat_id is the course name)
            chat_ref = db.collection('conversations').document(chat_id)
            chat_doc = chat_ref.get()
            if not chat_doc.exists:
                return {'error': f'Chat not found: {chat_id}'}, 404
            
            # Get message data
            text = data.get('text', '').strip()
            message_type = data.get('type', 'text')  # 'text' or 'image'
            quoted = data.get('quoted')  # Optional quoted message
            
            if not text and message_type == 'text':
                return {'error': 'Message text is required'}, 400
            
            # Create message (no UUID needed, just sender and timestamp)
            message_data = {
                'sender': 'John Doe',  # Default sender name
                'text': text if message_type == 'text' else None,
                'type': message_type,
                'liked': False,
                'timestamp': firestore.SERVER_TIMESTAMP,
                'status': 'online',
                'showHeader': True  # New messages always show header
            }
            
            if quoted:
                message_data['quoted'] = quoted
            
            if message_type == 'image' and data.get('fileName'):
                message_data['fileName'] = data.get('fileName')
            
            # Get current chats array and append new message
            chat_data = chat_doc.to_dict()
            chats = chat_data.get('chats', [])
            
            # Add index-based ID before appending
            message_id = len(chats)
            
            # Use Eastern Time instead of SERVER_TIMESTAMP since SERVER_TIMESTAMP
            # cannot be serialized inside arrays when using update()
            current_time = get_eastern_time()
            message_data['timestamp'] = current_time
            message_data['id'] = message_id
            
            chats.append(message_data)
            
            # Update conversation document with new chats array
            # Use set() with merge=True to update just the chats field
            chat_ref.set({'chats': chats}, merge=True)
            
            # Clean Firestore objects for JSON serialization
            cleaned_message = clean_firestore_data(message_data)
            
            return {'message': cleaned_message}, 201
        except Exception as e:
            import traceback
            error_msg = str(e)
            traceback.print_exc()  # Print to console for debugging
            return {'error': error_msg, 'details': traceback.format_exc()}, 500

class MessageLikeResource(Resource):
    def patch(self, chat_id, message_id):
        """Toggle like on a message"""
        try:
            # Verify chat exists (chat_id is the course name)
            chat_ref = db.collection('conversations').document(chat_id)
            chat_doc = chat_ref.get()
            if not chat_doc.exists:
                return {'error': 'Chat not found'}, 404
            
            chat_data = chat_doc.to_dict()
            chats = chat_data.get('chats', [])
            
            # Convert message_id to int (it's an index)
            try:
                msg_index = int(message_id)
            except (ValueError, TypeError):
                return {'error': 'Invalid message ID'}, 400
            
            # Check if index is valid
            if msg_index < 0 or msg_index >= len(chats):
                return {'error': 'Message not found'}, 404
            
            # Toggle like on the message at that index
            chats[msg_index]['liked'] = not chats[msg_index].get('liked', False)
            
            # Update conversation document with modified chats array
            chat_ref.update({'chats': chats})
            
            return {'liked': chats[msg_index].get('liked', False)}, 200
        except Exception as e:
            return {'error': str(e)}, 500

