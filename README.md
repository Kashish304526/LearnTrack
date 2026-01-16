# LearnTrack

The project is about building a Smart Study Planner and Track Task that helps users plan their daily study streaks, and see their progress in a dashboard. The goal is to help students stay organized, track their progress and study more effectively.

## Tech Stack
- Frontend: React + TypeScript + Tailwind CSS
- Backend: FastAPI + SQLAlchemy
- Authentication: JWT

## Features
- User registration and login
-	Create and manage daily study tasks
-	Create study plans for different subjects/topics
-	Mark tasks as completed
-	Track the progress and maintain streaks
-	Edit and delete tasks/ plans
-	 Use AI assistant for doubts
-	Summarize PDFs
-	Store all data securely in the backend database.

## How to Run
### Frontend:
```
--cd frontend
--npm install
--npm run dev
```

### Backend:
```
--cd backend
--python -m venv venv
--venv\Scripts\activate
--pip install -r requirements.txt
--uvicorn main:app --reload --port 8080
```

## Project Structure:
```text
project-root/
│
├── frontend/
│ │
│ ├── public/
│ │
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Login.tsx
│ │ │ ├── Register.tsx
│ │ │ ├── Dashboard.tsx
│ │ │ ├── StudyItems.tsx # Tasks + Plans UI
│ │ │ ├── Leaderboard.tsx
│ │ │ ├── AIAssistant.tsx
│ │ │ └── PDFSummarizer.tsx
│ │ │
│ │ ├── components/ 
│ │ ├── services/ 
│ │ ├── context/ 
│ │ ├── routes/ 
│ │ ├── App.tsx
│ │ └── main.tsx
│ │
│ ├── package.json
│ └── tsconfig.json
│
├── backend/
│ │
│ ├── main.py 
│ ├── database.py 
│ ├── dependencies.py 
│ ├── auth.py
│ ├── config.py 
│ │
│ ├── models.py 
│ ├── schemas.py
│ │
│ ├── routers/
│ │ ├── auth.py 
│ │ ├── study_items.py
│ │ ├── leaderboard.py
│ │ ├── ai.py 
│ │ └── pdf.py 
│ │
│ ├── .env 
│ ├── requirements.txt
│ └── README.md
│
├── .gitignore
└── README.md
```




-- Jaiswal Kashish
