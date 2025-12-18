from flask_restful import Resource
from flask import request
from google.cloud import firestore
from datetime import datetime
import time
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

def format_timestamp(timestamp):
    """Format Firestore timestamp to display format - always returns a formatted string"""
    if not timestamp:
        # Even if timestamp is falsy, try to extract from it or use current time
        return get_eastern_time().strftime('%I:%M %p')
    
    dt = None
    
    try:
        # Check for Firestore Timestamp object first (most common case)
        # Firestore Timestamp has both 'timestamp' method and 'seconds' attribute
        # Check by type name or by methods/attributes
        is_firestore_timestamp = (
            type(timestamp).__name__ == 'Timestamp' or
            (hasattr(timestamp, 'seconds') and hasattr(timestamp, 'nanos')) or
            hasattr(timestamp, 'to_datetime')
        )
        
        if is_firestore_timestamp:
            # Firestore Timestamp object - use to_datetime() method if available
            try:
                if hasattr(timestamp, 'to_datetime'):
                    dt = timestamp.to_datetime()
                elif hasattr(timestamp, 'seconds'):
                    # Fallback to seconds if to_datetime fails
                    nanos = getattr(timestamp, 'nanos', 0)
                    dt = datetime.fromtimestamp(timestamp.seconds + nanos / 1e9)
                else:
                    # Try timestamp() method as last resort
                    if hasattr(timestamp, 'timestamp'):
                        dt = datetime.fromtimestamp(timestamp.timestamp())
            except Exception as e:
                print(f"Error converting Firestore Timestamp: {e}")
                # Try seconds fallback
                if hasattr(timestamp, 'seconds'):
                    nanos = getattr(timestamp, 'nanos', 0)
                    dt = datetime.fromtimestamp(timestamp.seconds + nanos / 1e9)
        elif isinstance(timestamp, datetime):
            dt = timestamp
        elif isinstance(timestamp, str):
            # Handle ISO string format (from clean_firestore_data)
            try:
                # Try ISO format first
                dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            except:
                try:
                    # Try ISO format without Z
                    dt = datetime.fromisoformat(timestamp)
                except:
                    try:
                        # Try parsing as regular datetime string with microseconds
                        dt = datetime.strptime(timestamp, '%Y-%m-%dT%H:%M:%S.%f')
                    except:
                        try:
                            # Try parsing without microseconds
                            dt = datetime.strptime(timestamp, '%Y-%m-%dT%H:%M:%S')
                        except:
                            try:
                                # Try parsing date only
                                dt = datetime.strptime(timestamp, '%Y-%m-%d')
                            except:
                                # Try to extract numbers from string and use as timestamp
                                import re
                                numbers = re.findall(r'\d+', timestamp)
                                if numbers:
                                    # Try using the largest number as timestamp
                                    largest_num = max([int(n) for n in numbers])
                                    if largest_num > 1000000000000:  # milliseconds
                                        dt = datetime.fromtimestamp(largest_num / 1000)
                                    elif largest_num > 1000000000:  # seconds
                                        dt = datetime.fromtimestamp(largest_num)
        elif isinstance(timestamp, dict):
            # Handle dict format (might be from Firestore after cleaning)
            if 'seconds' in timestamp:
                dt = datetime.fromtimestamp(timestamp['seconds'])
            elif 'timestamp' in timestamp:
                # Recursive call if nested
                return format_timestamp(timestamp['timestamp'])
            elif '_seconds' in timestamp:
                dt = datetime.fromtimestamp(timestamp['_seconds'])
        elif isinstance(timestamp, (int, float)):
            # Handle numeric timestamp (seconds or milliseconds)
            if timestamp > 1000000000000:  # milliseconds
                dt = datetime.fromtimestamp(timestamp / 1000)
            else:  # seconds
                dt = datetime.fromtimestamp(timestamp)
        else:
            # Try to extract timestamp from object attributes
            if hasattr(timestamp, '__dict__'):
                # Try to find seconds or timestamp in object attributes
                attrs = timestamp.__dict__
                if 'seconds' in attrs:
                    dt = datetime.fromtimestamp(attrs['seconds'])
                elif 'timestamp' in attrs:
                    ts_val = attrs['timestamp']
                    if isinstance(ts_val, (int, float)):
                        dt = datetime.fromtimestamp(ts_val if ts_val < 1000000000000 else ts_val / 1000)
        
        # If dt is still None, try one more time with string conversion
        if dt is None:
            try:
                # Convert to string and try to parse
                ts_str = str(timestamp)
                # Try to find timestamp-like patterns
                import re
                # Look for Unix timestamp patterns
                match = re.search(r'(\d{10,13})', ts_str)
                if match:
                    ts_num = int(match.group(1))
                    if ts_num > 1000000000000:  # milliseconds
                        dt = datetime.fromtimestamp(ts_num / 1000)
                    else:  # seconds
                        dt = datetime.fromtimestamp(ts_num)
            except:
                pass
        
        # Final fallback: use current time if still None
        if dt is None:
            print(f"Warning: Could not parse timestamp, using current time. Type: {type(timestamp)}, Value: {timestamp}")
            dt = get_eastern_time()
        
        # Use Eastern Time for comparison
        now = get_eastern_time()
        # Ensure both datetimes are timezone-aware for comparison
        if dt.tzinfo is None:
            # If timestamp has no timezone, assume it's Eastern Time
            dt = EASTERN.localize(dt)
        else:
            # Convert to Eastern Time if it has a different timezone
            dt = dt.astimezone(EASTERN)
        diff = now - dt
        
        # Calculate time differences
        diff_seconds = diff.total_seconds()
        diff_minutes = diff_seconds / 60
        diff_hours = diff_minutes / 60
        diff_days = diff.days
        
        # Only show "Now" if message is less than 1 minute old
        if diff_minutes < 1 and diff_minutes >= 0:
            return 'Now'
        
        # Show relative time for older messages
        if diff_minutes < 60:
            # Less than 1 hour - show minutes ago
            minutes = int(diff_minutes)
            return f'{minutes} Minute{"s" if minutes != 1 else ""} Ago'
        elif diff_hours < 24:
            # Less than 1 day - show hours ago
            hours = int(diff_hours)
            return f'{hours} Hour{"s" if hours != 1 else ""} Ago'
        elif diff_days == 1:
            return 'Yesterday'
        elif diff_days < 7:
            # Less than 1 week - show days ago
            return f'{diff_days} Day{"s" if diff_days != 1 else ""} Ago'
        elif diff_days < 30:
            # Less than 1 month - show weeks ago
            weeks = diff_days // 7
            return f'{weeks} Week{"s" if weeks != 1 else ""} Ago'
        elif diff_days < 365:
            # Less than 1 year - show months ago
            months = diff_days // 30
            return f'{months} Month{"s" if months != 1 else ""} Ago'
        else:
            # Older than 1 year - show date
            return dt.strftime('%m/%d/%Y')
    except Exception as e:
        # Log the error for debugging but always return a formatted time
        print(f"Error formatting timestamp: {e}, timestamp type: {type(timestamp)}, value: {timestamp}")
        import traceback
        traceback.print_exc()
        # Return current time formatted as fallback
        try:
            return get_eastern_time().strftime('%I:%M %p')
        except:
            return datetime.now().strftime('%I:%M %p')

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

class ChatResource(Resource):
    def get(self):
        """Get all chats/conversations"""
        try:
            chats_ref = db.collection('conversations')
            docs = chats_ref.stream()
            
            conversations_list = []
            seen_ids = set()  # Track seen conversation IDs to prevent duplicates
            
            # Process all documents - no limit, get everything
            doc_count = 0
            for doc in docs:
                doc_count += 1
                chat_data = doc.to_dict()
                chat_data['id'] = doc.id
                
                # Skip if we've already seen this conversation (by document ID only)
                chat_id = chat_data.get('id')
                
                if chat_id in seen_ids:
                    continue  # Skip duplicate
                
                seen_ids.add(chat_id)
                
                # Get last message for preview from chats array
                chats_array = chat_data.get('chats', [])
                
                preview = 'No messages yet'
                last_time = None
                
                if chats_array and len(chats_array) > 0:
                    # Messages should be sorted by timestamp, get the last one
                    # Handle Firestore Timestamp objects for sorting
                    try:
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
                        
                        last_message = sorted(chats_array, key=get_timestamp_value, reverse=True)[0]
                        preview = last_message.get('text', '[Image]')
                        last_time = last_message.get('timestamp')
                    except Exception as e:
                        # Fallback: just get the last message in the array
                        last_message = chats_array[-1] if chats_array else None
                        if last_message:
                            preview = last_message.get('text', '[Image]')
                            last_time = last_message.get('timestamp')
                
                chat_data['preview'] = preview
                # Only show time if there are messages, otherwise leave empty
                if last_time:
                    chat_data['time'] = format_timestamp(last_time)
                else:
                    chat_data['time'] = ''
                
                # Store raw timestamp for accurate sorting
                if last_time:
                    try:
                        if hasattr(last_time, 'timestamp'):
                            chat_data['_lastMessageTimestamp'] = last_time.timestamp()
                        elif hasattr(last_time, 'seconds'):
                            chat_data['_lastMessageTimestamp'] = last_time.seconds
                        elif isinstance(last_time, datetime):
                            chat_data['_lastMessageTimestamp'] = last_time.timestamp()
                    except Exception:
                        pass
                
                # Set defaults
                chat_data.setdefault('isGroup', True)
                chat_data.setdefault('onlineCount', 0)
                chat_data.setdefault('unread', False)
                chat_data.setdefault('unreadCount', 0)
                chat_data.setdefault('chats', [])
                
                conversations_list.append(chat_data)
            
            # Log how many conversations were found
            print(f"Found {doc_count} documents, returning {len(conversations_list)} conversations")
            
            # Sort by last message time (most recent first)
            # Sort by timestamp if available, otherwise by time string
            def sort_key(chat):
                # Try to get actual timestamp for sorting
                chats_array = chat.get('chats', [])
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
                        last_msg = sorted(chats_array, key=get_timestamp_value, reverse=True)[0]
                        ts = last_msg.get('timestamp')
                        if ts:
                            if hasattr(ts, 'timestamp'):
                                return ts.timestamp()
                            elif hasattr(ts, 'seconds'):
                                return ts.seconds
                            elif isinstance(ts, datetime):
                                return ts.timestamp()
                    except Exception:
                        pass
                # Fallback: use _lastMessageTimestamp if available, otherwise return 0 (oldest)
                if chat.get('_lastMessageTimestamp'):
                    return chat.get('_lastMessageTimestamp')
                # Return 0 for chats with no messages (they'll sort to the end)
                return 0
            
            conversations_list.sort(key=sort_key, reverse=True)
            
            # Clean Firestore objects for JSON serialization
            cleaned_chats = clean_firestore_data(conversations_list)
            
            return {'chats': cleaned_chats}, 200
        except Exception as e:
            import traceback
            error_msg = str(e)
            traceback.print_exc()  # Print to console for debugging
            return {'error': error_msg, 'details': traceback.format_exc()}, 500

class ClassChatResource(Resource):
    def get(self, class_id):
        """Get or create chat for a specific class"""
        try:
            # Check if class exists
            class_doc = db.collection('classes').document(class_id).get()
            if not class_doc.exists:
                return {'error': 'Class not found'}, 404
            
            class_data = class_doc.to_dict()
            course_name = class_data.get('course_name', class_id)
            
            # Use course_name as the document ID
            chats_ref = db.collection('conversations')
            chat_doc_ref = chats_ref.document(course_name)
            chat_doc = chat_doc_ref.get()
            
            # Create chat if it doesn't exist
            if not chat_doc.exists:
                chat_data = {
                    'name': course_name,
                    'classId': class_id,
                    'code': class_id,
                    'isGroup': True,
                    'onlineCount': 0,
                    'unread': False,
                    'unreadCount': 0,
                    'chats': [],
                    'createdAt': firestore.SERVER_TIMESTAMP
                }
                chat_doc_ref.set(chat_data)
                chat_data['id'] = course_name
                chat_data['preview'] = 'No messages yet'
                chat_data['time'] = ''  # Empty time for chats with no messages
                return {'chat': chat_data}, 201
            
            # Return existing chat
            chat_data = chat_doc.to_dict()
            chat_data['id'] = course_name
            
            # Get last message for preview from chats array
            chats_array = chat_data.get('chats', [])
            
            preview = 'No messages yet'
            last_time = None
            
            if chats_array and len(chats_array) > 0:
                # Messages should be sorted by timestamp, get the last one
                try:
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
                    
                    last_message = sorted(chats_array, key=get_timestamp_value, reverse=True)[0]
                    preview = last_message.get('text', '[Image]')
                    last_time = last_message.get('timestamp')
                except Exception:
                    # Fallback: just get the last message in the array
                    last_message = chats_array[-1] if chats_array else None
                    if last_message:
                        preview = last_message.get('text', '[Image]')
                        last_time = last_message.get('timestamp')
            
            chat_data['preview'] = preview
            # Only show time if there are messages, otherwise leave empty
            if last_time:
                chat_data['time'] = format_timestamp(last_time)
            else:
                chat_data['time'] = ''
            # Store raw timestamp for accurate sorting
                if last_time:
                    try:
                        if hasattr(last_time, 'timestamp'):
                            chat_data['_lastMessageTimestamp'] = last_time.timestamp()
                        elif hasattr(last_time, 'seconds'):
                            chat_data['_lastMessageTimestamp'] = last_time.seconds
                        elif isinstance(last_time, datetime):
                            chat_data['_lastMessageTimestamp'] = last_time.timestamp()
                    except:
                        pass
                chat_data.setdefault('chats', [])
            
            # Clean Firestore objects for JSON serialization
            cleaned_data = clean_firestore_data(chat_data)
            
            return {'chat': cleaned_data}, 200
        except Exception as e:
            import traceback
            error_msg = str(e)
            traceback.print_exc()  # Print to console for debugging
            return {'error': error_msg}, 500
    
    def post(self, class_id):
        """Create chat when user joins a course - only creates if doesn't exist"""
        try:
            # Check if class exists
            class_doc = db.collection('classes').document(class_id).get()
            if not class_doc.exists:
                return {'error': 'Class not found'}, 404
            
            class_data = class_doc.to_dict()
            course_name = class_data.get('course_name', class_id)
            
            # Use course_name as the document ID
            chats_ref = db.collection('conversations')
            chat_doc_ref = chats_ref.document(course_name)
            chat_doc = chat_doc_ref.get()
            
            # Only create chat if it doesn't already exist
            if not chat_doc.exists:
                chat_data = {
                    'name': course_name,
                    'classId': class_id,
                    'code': class_id,
                    'isGroup': True,
                    'onlineCount': 0,
                    'unread': False,
                    'unreadCount': 0,
                    'chats': [],
                    'createdAt': firestore.SERVER_TIMESTAMP
                }
                chat_doc_ref.set(chat_data)
                # Prepare response data (remove SERVER_TIMESTAMP which can't be serialized)
                response_data = {
                    'id': course_name,
                    'name': course_name,
                    'classId': class_id,
                    'code': class_id,
                    'isGroup': True,
                    'onlineCount': 0,
                    'unread': False,
                    'unreadCount': 0,
                    'chats': [],
                    'preview': 'No messages yet',
                    'time': ''  # Empty time for chats with no messages
                }
                return {'chat': response_data, 'created': True}, 201
            
            # Chat already exists - return it without creating
            chat_data = chat_doc.to_dict()
            chat_data['id'] = course_name
            
            # Get last message for preview from chats array
            chats_array = chat_data.get('chats', [])
            preview = 'No messages yet'
            last_time = None
            
            if chats_array and len(chats_array) > 0:
                try:
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
                    
                    last_message = sorted(chats_array, key=get_timestamp_value, reverse=True)[0]
                    preview = last_message.get('text', '[Image]')
                    last_time = last_message.get('timestamp')
                except Exception:
                    # Fallback: just get the last message in the array
                    last_message = chats_array[-1] if chats_array else None
                    if last_message:
                        preview = last_message.get('text', '[Image]')
                        last_time = last_message.get('timestamp')
            
            chat_data['preview'] = preview
            # Only show time if there are messages, otherwise leave empty
            if last_time:
                chat_data['time'] = format_timestamp(last_time)
            else:
                chat_data['time'] = ''
            # Store raw timestamp for accurate sorting
                if last_time:
                    try:
                        if hasattr(last_time, 'timestamp'):
                            chat_data['_lastMessageTimestamp'] = last_time.timestamp()
                        elif hasattr(last_time, 'seconds'):
                            chat_data['_lastMessageTimestamp'] = last_time.seconds
                        elif isinstance(last_time, datetime):
                            chat_data['_lastMessageTimestamp'] = last_time.timestamp()
                    except:
                        pass
                chat_data.setdefault('chats', [])
            
            # Clean Firestore objects for JSON serialization
            cleaned_data = clean_firestore_data(chat_data)
            
            return {'chat': cleaned_data, 'created': False}, 200
        except Exception as e:
            import traceback
            error_msg = str(e)
            traceback.print_exc()  # Print to console for debugging
            return {'error': error_msg, 'details': traceback.format_exc()}, 500

