# CoachVerse

CoachVerse is a modern AI-powered coaching platform designed to connect users with smart virtual coaches for general coaching, guidance, mentoring, and personal development. The platform combines modern mobile and web development with AI capabilities to deliver personalized coaching, real-time conversations, and actionable insights.

🌐 Live Platform

🔗 Web App: https://coach-verse-eta.vercel.app/
    Video Demo: https://youtu.be/JF6ANMFEGFM

🎯 Purpose

CoachVerse focuses purely on coaching — helping users think clearly, grow personally or professionally, and receive structured guidance through AI-powered conversations.

🌟 Features

🤖 AI Coach Chat – Interactive AI-based coaching using LLMs

🧭 Personal Coaching & Guidance – One-on-one style AI coaching for clarity, growth, and decision-making

📊 Personalized Coaching Plans – AI-driven guidance based on user goals, inputs, and ongoing conversations

🔐 Authentication System – Secure login & signup (Firebase/Auth-based)

📱 Cross-Platform Apps – Mobile (Android & iOS) using React Native (Expo) and Web using modern frameworks

☁️ Cloud Backend – Scalable backend with API integration

🧠 Smart Conversations – Context-aware AI responses

📈 Future Ready – Easily extendable for analytics, wearables, and dashboards

🛠️ Tech Stack
Frontend (Mobile App)

React Native

Expo

TypeScript / JavaScript

Expo Router / React Navigation

Backend

Node.js / FastAPI (API Layer)

REST APIs

JWT Authentication

AI & ML

LLM-based AI Coaches

Context-aware Conversations

Prompt Engineering

Database & Cloud

MongoDB / Firebase

Firebase Authentication

Cloud Hosting (Vercel / Render)

📂 Project Structure
CoachVerse/
│── mobile/            # React Native (Expo) app
│── backend/           # API & AI services
│── assets/            # Images & static files
│── README.md          # Project documentation
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/CoachVerse.git
cd CoachVerse
2️⃣ Mobile App Setup
cd mobile
npm install
npx expo start
3️⃣ Backend Setup
cd backend
npm install   # or pip install -r requirements.txt
npm run dev   # or uvicorn main:app --reload
🔐 Environment Variables

Create a .env file in backend/mobile as required:

OPENAI_API_KEY=your_api_key
MONGODB_URL=your_db_url
JWT_SECRET=your_secret
FIREBASE_API_KEY=your_firebase_key
#Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=Your_gmail@gmail.com
SMTP_PASS=Your_password
FROM_EMAIL=Your_gmail@gmail.com
FROM_NAME=Appication name
🚧 Roadmap

✅ AI Chat Integration

✅ Authentication System

🔄 User Progress Tracking

🔄 Analytics Dashboard

🔄 Voice-based AI Coach

🔄 Wearable Device Integration

🤝 Contributing

Contributions are welcome!

Fork the repository

Create your feature branch (git checkout -b feature/new-feature)

Commit changes (git commit -m "Add new feature")

Push to branch (git push origin feature/new-feature)

Open a Pull Request

📄 License

This project is licensed under the MIT License.

👨‍💻 Author

CoachVerse Team
Built with ❤️ using React Native & AI

⭐ Support

If you like this project, please give it a ⭐ on GitHub and share feedback!

