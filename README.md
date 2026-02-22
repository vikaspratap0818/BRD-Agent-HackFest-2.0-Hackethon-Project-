# BRD Intelligence Agent

AI-powered Business Requirements Document generator from multi-channel communications.

## Project Structure
```
brd-agent/
├── frontend/     ← React app (UI)
└── backend/      ← Express.js API + Gemini AI
```

---

## Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and add your Gemini API key:
# GEMINI_API_KEY=your_key_here
```
Get your Gemini API key at: https://aistudio.google.com/app/apikey

### 3. Start backend
```bash
npm run dev    # development (auto-reload)
npm start      # production
```
Backend runs on: http://localhost:5000

---

## Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Start frontend
```bash
npm start
```
Frontend runs on: http://localhost:3000

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/dashboard` | Dashboard stats |
| POST | `/api/upload` | Upload file (multipart/form-data) |
| POST | `/api/analyze/:fileId` | Start AI analysis |
| GET | `/api/analysis/:analysisId/status` | Poll analysis status |
| GET | `/api/brd/:brdId` | Get full BRD |
| GET | `/api/brd/:brdId/insights` | Get extracted insights |
| GET | `/api/brds` | List all BRDs |
| POST | `/api/brd/:brdId/chat` | Chat with AI about a BRD |

---

## Features
- 📁 **Multi-Channel Upload**: Email, Meeting Transcript, Chat, API
- 🤖 **Gemini AI Analysis**: Auto-extracts requirements, stakeholders, decisions
- 📊 **Extracted Insights**: FR, NFR, Key Decisions, Stakeholder Mapping, Timeline
- 📄 **BRD Generation**: Professional document with download/export options
- 📈 **Dashboard**: Stats, recent activity, project overview

## Tech Stack
- **Frontend**: React 18, Axios
- **Backend**: Node.js, Express, Multer, Google Generative AI
- **AI**: Google Gemini 1.5 Flash

###Live Demo : https://brd-agent-hackfest-2-0-hackethon-project-z9pa.onrender.com
