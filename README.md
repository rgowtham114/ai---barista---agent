# AI Barista Agent ☕

An interactive web application powered by **Google Gemini AI** and **React + Express** that recommends drinks, pastries, and custom orders from a coffee shop menu.

## Features

- 📜 **Interactive Menu**: Explore drinks, pastries, allergen disclosures, and tags in real-time.
- 🤖 **AI Barista Assistant**: Chat with an AI barista powered by `@google/genai` (`gemini-3.6-flash`).
- ⚡ **Personalized Recommendations**: Filters and answers user queries regarding ingredients, cold/hot drinks, sweetness, and dietary preferences (e.g., dairy-free, vegan).
- 💡 **Quick Suggestions**: Pre-populated one-click prompts for fast ordering queries.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Express, Node.js (`tsx`)
- **AI Integration**: `@google/genai` (Gemini API)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd ai-barista-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:3000`.

## Scripts

- `npm run dev`: Starts the development server with Vite and Express middleware.
- `npm run build`: Bundles the client and compiles the backend server for production.
- `npm start`: Runs the compiled CommonJS server in production mode.
