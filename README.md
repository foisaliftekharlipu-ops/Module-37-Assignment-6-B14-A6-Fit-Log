# 🏋️‍♂️ FitLog — Workout Library & Routine Planner

FitLog is a modern, dark-themed gym companion and workout logging web application built with **Next.js (App Router)** and **Tailwind CSS**. It enables athletes to explore a curated library of lifts across all major muscle groups, inspect comprehensive exercise specifications with step-by-step instructions, log a personalized daily routine capped at 5 exercises, and bookmark favorite workouts for future sessions.

---

## 🌐 Live Application & Repository Links

- **Live Application URL:** [https://fitlog-workout.vercel.app](https://your-deployment-link.vercel.app) *(Replace with your live deployed URL)*
- **GitHub Repository:** [https://github.com/foisaliftekharlipu-ops/Module-37-Assignment-6-B14-A6-Fit-Log](https://github.com/foisaliftekharlipu-ops/Module-37-Assignment-6-B14-A6-Fit-Log)

---

## 🚀 Key Features

1. **Curated Workout Library (3x4 Responsive Grid):**
   - Fetches exercises from the external FitLog REST API with custom loading states and spinner animations.
   - Smooth anchor navigation linking the Hero section directly to `#library`.
   - Dynamic cards showing equipment requirements, targeted category tags, duration, estimated calories, and user ratings.

2. **Comprehensive Workout Details:**
   - Two-column visual layout featuring high-resolution exercise imagery alongside key training specs (Sets, Reps, Difficulty, Equipment, Duration, Calories, Rating).
   - Ordered list of step-by-step form instructions.
   - Direct action triggers to add lifts into the daily training plan or save them for later.

3. **Smart 5-Lift Daily Cap Enforcement:**
   - Enforces the daily routine limitation: *"Cap of five lifts for today. Finish them, then load more."*
   - Context-aware validation prevents adding more than 5 exercises to "Today's Plan", displaying timely toast alerts without restricting the "Saved" collection.

4. **Dynamic Aggregated Metrics & Live Multi-Metric Sorting (Challenge C1):**
   - Dynamic summary panel calculating total planned exercises, accumulated workout minutes, and burned calories in real time.
   - Interactive dropdown allowing users to sort their workout plan by **Duration**, **Calories**, or **Rating** on the fly.

5. **Routine Logging & Persistent State Management (Challenge C3 & Storage):**
   - Interactive workflow buttons on planned cards: **"Mark as Done"** (with check icon) and **"Remove (✕)"**, complete with clean single toast notifications.
   - Global application state powered by React Context API and synced with `localStorage` so data survives page reloads without hydration issues.

6. **Fully Responsive Dark UI & Custom 404 Experience:**
   - Mobile-first architecture that seamlessly adapts navigation badges, stacked card layouts, and summary counters across mobile, tablet, and desktop screens.
   - Dedicated `not-found.tsx` handler providing a branded error experience for nonexistent paths.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **Next.js 15+ (App Router)** | Client-side routing, layout nesting, and fast page rendering |
| **TypeScript** | Type safety, interface definitions, and static verification |
| **Tailwind CSS** | Custom styling matching the Figma dark neon aesthetic (`#ccff00`, `#12141a`) |
| **Context API** | Global state orchestration for daily plans, saved lifts, and badge tallies |
| **Lucide React** | Lightweight modern icon set |
| **React Hot Toast** | Toast notification system for non-blocking feedback |
| **Vercel** | Production hosting and continuous edge deployment |

---

## 📦 Local Setup & Installation

Follow these steps to run the project locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/foisaliftekharlipu-ops/Module-37-Assignment-6-B14-A6-Fit-Log.git
cd Module-37-Assignment-6-B14-A6-Fit-Log
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 📄 License
This project was developed for educational purposes as part of the Programming Hero Web Development Course (Batch 14, Assignment 6).