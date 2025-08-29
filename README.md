# 🤖 AI-Powered Video Call App

An **AI-first SaaS platform** for real-time video calls with custom AI agents, meeting transcripts, searchable histories, and post-call insights.  
Built with **Next.js 15, React 19, Tailwind v4, Shadcn/ui, and Inngest** — this project demonstrates how to combine **AI orchestration** with modern SaaS tooling to deliver a seamless meeting experience.

---

## ✨ Features
- 📞 AI-powered video calls with real-time collaboration  
- 🧠 Custom AI agents to assist during calls  
- 💬 Stream Video SDK + Stream Chat SDK for scalable infra  
- 📝 Meeting summaries, transcripts, and recordings  
- 📂 Meeting history & status tracking  
- 🔍 Transcript search across conversations  
- 📺 Video playback with synced transcripts  
- 💬 AI Meeting Q&A — ask questions about your meetings  
- 🔐 Better Auth login  
- 💳 Polar subscriptions (SaaS-ready billing)  
- ⚙️ Inngest background jobs for transcription & processing  
- 🧠 OpenAI integration (summaries & contextual chat)  
- 📱 Mobile responsive UI with Tailwind v4 + Shadcn/ui  
- 🧑‍💻 AI-assisted PR reviews via CodeRabbit  

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 15, React 19, Tailwind v4, Shadcn/ui  
- **Video & Chat Infra**: Stream Video SDK, Stream Chat SDK  
- **AI Models**: OpenAI  
- **Auth & Billing**: Better Auth, Polar  
- **Background Jobs**: Inngest  
- **Database**: Prisma + Neon  
- **Dev Workflow**: CodeRabbit AI PR reviews  

---

## 🚀 Getting Started
```bash
# Clone the repo
git clone https://github.com/your-username/ai-video-call-app.git
cd ai-video-call-app

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env   # then update values inside

# Run database migrations
npx prisma migrate dev

# Start the dev server
pnpm dev
