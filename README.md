<div align="center">
  <h1 className="text-4xl font-bold text-blue-600">VisaHire</h1>
  <p>H-1B Job Search Platform for International Students</p>
</div>

---

## 🚀 Overview

VisaHire is a frontend application built to connect international students with employers who actively sponsor H-1B visas. This project has been refactored from a flat prototype into a highly scalable, production-ready architecture.

### ✨ Key Features
*   **Targeted Job Search**: Filter roles strictly by H-1B and Green Card sponsorship availability.
*   **Resume Matching**: AI-driven (simulated) match scores evaluating applicant skills against specific sponsor requirements.
*   **Sponsorship Stats**: Historical deep-dives into company petition volumes, approval rates, and salary percentiles.
*   **Alumni Network**: Connect with former international students who successfully navigated the immigration-to-employment pipeline.
*   **Dark Mode Support**: Full native dark mode integrated via Tailwind CSS v4.

---

## 🏗️ Architecture

The codebase has been restructured to separate concerns and prepare for seamless backend API integration.

*   `src/components/`: Reusable UI elements (Buttons, Badges, Cards, Loaders).
*   `src/layouts/`: Structural wrappers (e.g., Sidebar + TopBar).
*   `src/pages/`: Domain-specific view assemblies (Dashboard, JobSearch).
*   `src/routes/`: Centralized React Router configuration.
*   `src/services/`: API communication layer handling requests, responses, and mock fallbacks based on environment variables.
*   `src/context/`: Global state management for User, Themes, and Saved Jobs.
*   `src/data/`: Strictly typed mock data entities enforcing schema shapes.

---

## 💻 Running Locally

This project uses **Vite** + **React** + **TypeScript**.

### Prerequisites

*   Node.js (v18+ recommended)
*   npm

### Setup Instructions

1.  **Clone the repository** and navigate to the project root.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Copy `.env.example` to `.env` (it will default to using robust mock data simulating backend delays).
    ```bash
    cp .env.example .env
    ```
4.  **Start the development server**:
    ```bash
    npm run dev
    ```

### Available Scripts

*   `npm run dev`: Starts the local development server.
*   `npm run build`: Compiles the TypeScript and builds the production bundle via Vite.
*   `npm run lint`: Runs ESLint to identify code quality issues.
*   `npm run preview`: Locally previews the built production bundle.

---

## 🎨 Theme Configuration

This project was upgraded to utilize **Tailwind CSS v4**. Theme variables and system-wide dark mode overrides are defined directly in `src/index.css` leveraging the modern `@theme` directive, removing the need for an external `tailwind.config.js` file.
