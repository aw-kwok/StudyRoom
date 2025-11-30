# StudyRoom

## Overview
StudyRoom is a full-stack web application designed to help Columbia CS students easily find and join group chats for their classes. Many students struggle to discover existing group chats, often relying on personal connections. StudyRoom solves this problem by providing a centralized platform where users can access and manage group chats for computer science courses, making collaboration and communication more accessible for everyone.

## Project Structure
```
StudyRoom/
  frontend/   # Next.js app (React)
  backend/    # Flask app (Python)
  README.md
```

## Getting Started

### Frontend (Next.js)
1. Navigate to the `frontend` folder:
	```sh
	cd frontend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Start the development server:
	```sh
	npm run dev
	```
4. Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Backend (Flask)
1. Navigate to the `backend` folder:
	```sh
	cd backend
	```
2. Create and activate a virtual environment:
	```sh
	python3 -m venv venv
	source venv/bin/activate
	```
3. Install dependencies:
	```sh
	pip install -r requirements.txt
	```
4. Run the Flask app:
	```sh
	python app.py
	```
5. Visit [http://localhost:5000](http://localhost:5000) in your browser.

## Contributing
1. Fork the repository and create your branch from `main`.
2. Make sure to add or update tests as appropriate.
3. Submit a pull request with a clear description of your changes.

## License
This project is licensed under the MIT License.