# Habit Coach Pro

ZICO Habit Intelligence - Frontend Generation Prompt

Build a modern, premium, responsive React + TypeScript application for ZICO Habit Intelligence.

The application is an AI-powered habit tracking platform that predicts the probability of completing today's habit using a Machine Learning model and provides personalized coaching using an LLM.

This prompt is ONLY for the frontend. Do not implement backend logic, machine learning, or databases. Use mock data where necessary, but structure the application so it can easily connect to a FastAPI backend later.

Design Language

Create a clean, modern, premium interface.

Style:

Minimal

Apple-like spacing

Rounded cards

Soft shadows

Smooth animations

Excellent typography

Responsive

Accessible

Dark and Light mode

Professional dashboard aesthetic

Color palette:

Primary: Indigo / Blue

Success: Green

Warning: Amber

Danger: Red

Pages

1. Dashboard

Display:

Welcome section

Current active habit

Current streak

Today's completion probability

Quick statistics

Recent activity

Prediction card

AI Coach preview

The prediction should be displayed as a circular progress indicator.

Example:

Today's Prediction

82%

High likelihood of success

2. Habits Page

Display all habits.

Each habit card should contain:

Habit name

Archetype

Current streak

Last prediction

Completion rate

Actions:

Open habit

Edit

Delete

Floating button:

Add Habit

3. Create Habit Modal

Fields:

Habit Name

Archetype

Archetype options:

Student

Professional

Deep Worker

Early Bird

Night Owl

Recovery

Custom

Save button

Cancel button

4. Daily Check-in Page

This is the most important screen.

Display an input form for today's metrics.

Fields:

Sleep Hours

Slider

Range:

0–12

Mood Score

Slider

Range:

1–10

Energy Level

Segmented buttons

1

2

3

Meals Eaten

Stepper

0–5

Workload Hours

Slider

0–16

Habit Duration (Minutes)

Slider

5–180

Interruptions

Stepper

0–20

Medication

Toggle

Yes / No

The following fields should NOT appear because they are automatically handled by the backend:

Streak

Completed Yesterday

Is Weekend

Buttons:

Predict Today

Reset

Prediction Result

After clicking Predict:

Display a premium prediction dashboard.

Show:

Large percentage

Example

78%

Completion Probability

Then display:

Risk Level

Low

Medium

High

Color coded.

AI Coach Card

Display four sections.

Summary

Risks

Recommendations

Motivation

Use cards with icons.

Example structure:

Summary

Today looks promising because your sleep and workload are balanced.

Risks

Heavy workload

Long habit duration

Recommendations

Complete your habit before lunch.

Reduce today's session to 30 minutes.

Silence notifications.

Motivation

Protecting today's streak makes tomorrow easier.

History Page

Display previous logs.

Use a table.

Columns:

Date

Habit

Prediction

Completed

Streak

Filter by:

Habit

Date

Completion

Statistics Page

Create beautiful charts using placeholder data.

Show:

Weekly completion rate

Monthly completion rate

Current streak

Longest streak

Average sleep

Average workload

Prediction accuracy

Include:

Line charts

Bar charts

Pie chart

Progress cards

Navigation

Desktop:

Left sidebar

Mobile:

Bottom navigation

Navigation Items:

Dashboard

Habits

Check-in

History

Statistics

Settings

Settings Page

Theme

Dark Mode

Light Mode

System

Model Information

Placeholder:

Current Model

Default Student Model

Future:

Personalized Model

Device Information

Export Data button

Import Data button

About

Components

Create reusable components.

Examples:

StatCard

HabitCard

PredictionGauge

ProgressRing

MetricSlider

CoachCard

SectionHeader

PageContainer

LoadingSpinner

EmptyState

ConfirmationDialog

API Integration

Do NOT implement the backend.

Create an API service layer with placeholder endpoints.

Example endpoints:

GET /api/v1/habits

POST /api/v1/habits

POST /api/v1/predict

POST /api/v1/log-outcome

GET /api/v1/history

Use mock JSON responses.

Expected Prediction Response

The frontend should expect a response similar to:

{
  "probability": 0.82,
  "prediction": 1,
  "coach": {
    "summary": "...",
    "risks": [
      "...",
      "..."
    ],
    "recommendations": [
      "...",
      "...",
      "..."
    ],
    "motivation": "..."
  }
}


The UI should already be wired to consume this shape.

User Experience

Use loading skeletons while waiting for prediction.

Animate the probability gauge.

Smooth card transitions.

Toast notifications.

Confirmation dialogs where appropriate.

Gracefully handle API errors.

Technical Requirements

React

TypeScript

Tailwind CSS

shadcn/ui

React Hook Form

Zod validation

TanStack Query

React Router

Recharts for charts

Lucide React icons

Framer Motion animations

Use clean component architecture.

Keep components reusable.

Avoid duplicate code.

Follow modern React best practices.

The final result should look like a polished production SaaS application rather than a simple CRUD habit tracker.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/be403209-5da9-4a8b-a7d7-26fe29d84d5d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
