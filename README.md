# FitGuru365 🏋️‍♂️🤖

> **Your Transformation, Automated by Intelligence.**

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8E75B2)

FitGuru365 is a comprehensive, full-stack fitness coaching platform that bridges the gap between human empathy and software precision. It uses **Google's Gemini AI** to generate personalized nutrition and training plans while employing a custom **Smart Engine** to automatically adjust weekly calorie targets based on user metabolic trends.

## 🚀 Key Features

### 🧠 AI-Powered Planning
* **Smart Diet Generator:** Generates full daily meal plans based on exact calorie/macro targets, dietary restrictions (Vegan, Keto, etc.), allergies, and favorite foods using **Gemini 2.5 Flash**.
* **Intelligent Workout Builder:** Creates 2-6 day training splits tailored to experience level (Beginner/Intermediate/Advanced) and specific fitness goals.
* **Rate Limiting:** Built-in safeguards restrict plan generation to 3 times per week to prevent abuse.

### 📉 Dynamic Coaching Engine
* **Automated Weekly Adjustments:** The core "Smart Engine" analyzes weekly weight trends and adherence consistency. It automatically increases or decreases calorie targets to break plateaus or prevent rapid weight gain/loss.
* **Bio-Individual Constraints:** Logic gates ensure protein and calorie recommendations respect age, BMI, and training maturity (e.g., lower protein needs for older adults, higher deficits allowed for higher BMI).

### 📊 User Dashboard
* **Progress Tracking:** Interactive charts (Recharts) visualize weight trends over time.
* **Adherence Logging:** Users track diet and training consistency (0-100%) which feeds into the adjustment algorithm.
* **Smart Notifications:**
    * **In-App Alerts:** Dynamic message center warns users if they miss a weekly log.
    * **Calendar Integration:** "Add to Calendar" button sets recurring weekly reminders.

## 🛠️ Tech Stack

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
* **Database:** [MongoDB](https://www.mongodb.com/) (via Mongoose)
* **Authentication:** [Firebase Auth](https://firebase.google.com/) (Client-side & Server-side validation)
* **AI Model:** [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
* **Visualization:** [Recharts](https://recharts.org/)

## ⚡ Getting Started

### Prerequisites
* Node.js 18+ installed.
* A MongoDB Atlas cluster (or local instance).
* A Firebase project.
* A Google AI Studio API Key.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/fitguru365.git](https://github.com/yourusername/fitguru365.git)
    cd fitguru365
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add the following keys:

    ```env
    # Database
    MONGODB_URI=your_mongodb_connection_string

    # Google Gemini AI
    GEMINI_API_KEY=your_gemini_api_key

    # Firebase Client SDK
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```bash
├── app
│   ├── api          # Next.js API Routes (Backend Logic)
│   │   ├── ai       # Gemini integration (Diet/Workout generation)
│   │   └── user     # User CRUD & Weight Logging
│   ├── dashboard    # Main User Interface
│   ├── onboarding   # Initial Profile Setup
│   └── ...
├── components       # Reusable UI Components (Buttons, Charts, etc.)
├── lib
│   ├── db.ts            # Database connection
│   └── fitnessEngine.ts # Core algorithm for macro calculations
├── models           # Mongoose Schemas (User.ts)
└── public           # Static assets