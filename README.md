# ExamPulse — Full-Stack Examination & Live Proctoring System

## 1. Aim & Problem Statement
ExamPulse automates end-to-end academic and certification assessments—combining JWT role-based access control, timed exam delivery, real-time WebSocket proctoring, and instant analytics in a responsive React + Node.js + MongoDB stack.

## 2. Quick Frontend-Only Run (Fastest)
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. Use the one-click **Faculty / Admin Demo** or **Student Portal Demo** buttons on the home screen (works offline with built-in demo data when backend is not connected, and automatically connects to the REST API + Socket.IO when the backend is running).

## 3. Full-Stack Local Setup (Frontend + Backend + MongoDB)
1. **Configure Environment**
   ```bash
   cp server/.env.example server/.env
   ```
2. **Install Dependencies & Seed Demo Users**
   ```bash
   cd server
   npm install
   npm run seed
   ```
   - **Admin:** `admin@exampulse.edu` / `Password123`
   - **Student:** `student@exampulse.edu` / `Password123`
3. **Run Both Servers**
   ```bash
   # Terminal 1 (Backend on :5000)
   cd server && npm run dev

   # Terminal 2 (Frontend on :5173)
   cd client && npm run dev
   ```

## 4. One-Command Docker Deployment
```bash
docker compose up --build -d
```
Access the full-stack application at `http://localhost:5000`.
