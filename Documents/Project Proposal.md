# FitGuru365: AI-Powered Fitness Coaching Platform
### Project Proposal & Specification

**Prepared By:** Prashant Nigam
**Date:** January 2026

---

## 1. Executive Summary
FitGuru365 is a full-stack, AI-driven fitness coaching application designed to bridge the gap between expensive personal coaching and generic fitness apps. While most apps provide static plans, FitGuru365 utilizes a proprietary **"Smart Engine"** and **Generative AI (Google Gemini)** to adapt to the user's biology in real-time.

The platform offers a holistic ecosystem where users receive personalized nutrition targets, AI-generated meal & workout plans, and weekly metabolic adjustments based on their actual progress and adherence data. It is designed to serve as a daily companion—365 days a year—simplifying the complex math of body transformation.

## 2. Core Features & Functionality

### 🧠 2.1. AI-Driven Plan Generation (Google Gemini)
Unlike static templates, FitGuru365 uses Large Language Models to generate unique plans on demand.
* **Custom Diet Planner:** Generates detailed daily meal plans considering specific calorie/macro targets, dietary restrictions (Vegan, Keto, etc.), allergies, and favorite foods.
* **Intelligent Workout Builder:** Creates training splits (Push/Pull/Legs, Upper/Lower, etc.) tailored to the user's experience level, goal, and frequency (2-6 days/week).
* **Rate Limiting:** Implements a strict "One Plan Per Day" limit to ensure thoughtful planning and prevent API abuse.

### ⚙️ 2.2. The "Smart Adjustment Engine"
The app’s core differentiator is its ability to act like a real coach.
* **Weekly Check-Ins:** Users log their weight and adherence (Diet/Training consistency %).
* **Dynamic Calibration:** The engine analyzes the rate of weight change against the user's goal.
    * *Plateau Detection:* If weight loss stalls while adherence is high, calories are automatically lowered.
    * *Safety Guardrails:* If weight loss is too rapid (>1% body weight/week), calories are increased to preserve muscle mass.
* **Bio-Individual Constraints:** Logic gates automatically adjust protein requirements based on Age (>30) and Experience Level to ensure realistic, safe targets.

### 📊 2.3. Interactive Dashboard
A centralized hub for tracking progress and daily actions.
* **Visual Analytics:** Interactive charts (powered by Recharts) display weight trends over time.
* **Live Macro Tracking:** Displays current daily targets for Protein, Carbs, Fats, and Calories.
* **In-App Message Center:** A notification system that alerts users when they are overdue for a weigh-in or have incomplete profile data.

### 📅 2.4. Accountability Systems
* **Calendar Integration:** Users can click a single button to add a recurring "Weekly Weigh-In" reminder to their Google/Apple Calendar.
* **Consistency Tracking:** Users self-report "Diet Adherence" and "Training Adherence" (0-100%) with every log, which feeds into the adjustment algorithm.

## 3. Technology Stack

### Frontend
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + Shadcn/UI
* **Visualization:** Recharts (Data visualization library)
* **Icons:** Lucide React

### Backend & Infrastructure
* **Database:** MongoDB (via Mongoose ODM)
* **Authentication:** Firebase Auth (Secure, token-based session management)
* **AI Integration:** Google GenAI SDK (Gemini 2.5 Flash Model)
* **API:** Next.js Server Actions & API Routes

## 4. User Stories

### Onboarding & Profile
1.  **Smart Onboarding:** "As a user, I want to input my age, height, weight, and experience level so the app can calculate my exact BMR and TDEE."
2.  **Constraint Logic:** "As a beginner or older adult, I want the app to automatically adjust protein recommendations so I'm not overwhelmed by unrealistic targets."

### AI Planning
3.  **Diet Generation:** "As a user with a peanut allergy who loves chicken, I want a meal plan that excludes nuts and includes chicken recipes while hitting my exact 2200 calorie goal."
4.  **Workout Generation:** "As a busy professional who can only train 3 days a week, I want a full-body split designed specifically for muscle gain."

### Progress & Adjustment
5.  **Weekly Log:** "As a user, I want to log my weight once a week and have the app tell me if I'm on track."
6.  **Auto-Adjustment:** "As a user hitting a plateau, I want the app to automatically lower my calories slightly so I can keep losing fat without doing the math myself."
7.  **Reminders:** "As a forgetful user, I want to add a reminder to my Google Calendar so I never miss a check-in."

## 5. System Architecture & Safety

FitGuru365 implements several layers of logic to ensure user safety and data integrity:

* **Metric Bounds:** Inputs are validated (e.g., Age 10-70, Weight 30-150kg) to prevent dangerous calculations.
* **BMI Awareness:** The initial calorie calculator adjusts deficits based on BMI (e.g., higher BMI allows for slightly more aggressive deficits safely).
* **Secure Data:** All sensitive user data is stored in MongoDB with protected API routes that verify Firebase Authentication tokens before every request.

## 6. Future Roadmap

* **1RM (One-Rep Max) Calculator:** To assist with strength programming.
* **Social Community:** Friend lists and leaderboard integration.
* **Premium Coaching Access:** Direct chat integration with certified trainers.

---
**FitGuru365** represents the future of accessible fitness—where AI handles the planning, and the user focuses on the execution.