# DSA Buddy - Your AI-Powered DSA Learning Companion

An interactive, AI-powered chatbot designed to be a personal mentor for learning Data Structures and Algorithms (DSA). It features a 3D landing page and a friendly, conversational UI to make learning engaging and effective.

## Key Features

-   **🤖 Interactive AI Chatbot**: Powered by Google's Gemini Pro, the chatbot acts as a personal DSA mentor named "Rohit Negi".
-   **🚀 Engaging User Experience**: A 3D animated landing page built with Spline and a sleek, modern chat interface.
-   **📚 From Basics to Advanced**: The mentor persona is designed to break down complex topics into simple steps, starting from a zero level.
-   **✨ Rich Content Formatting**: Displays code with syntax highlighting and a copy-to-clipboard button for ease of use.
-   **🎤 Voice Input**: Supports speech recognition for hands-free interaction.
-   **Streamed Responses**: Fetches and displays AI responses in real-time for a dynamic conversation.
-   **Hinglish Support**: The AI can converse in Hinglish to create a more comfortable and "chill but focused" learning environment.

## Technology Stack

### Frontend

-   **Framework/Library**: React
-   **Styling**: Tailwind CSS, DaisyUI
-   **3D Scene**: Spline (@splinetool/react-spline)
-   **Animations**: AOS (Animate on Scroll)
-   **Routing**: React Router
-   **UI Components**:
    -   `react-markdown` for rendering Markdown content.
    -   `react-syntax-highlighter` for code blocks.
    -   `react-speech-recognition` for voice input.
    -   `react-textarea-autosize` for a flexible input field.

### Backend

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **AI**: Google Gemini Pro via `@google/genai`
-   **Middleware**: `cors` for handling cross-origin requests.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   Node.js & npm
-   A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_REPOSITORY_URL>
    cd <project-directory>
    ```
2.  **Install backend dependencies:**
    ```sh
    cd server
    npm install
    ```
3.  **Install frontend dependencies:**
    ```sh
    cd ../
    npm install
    ```
4.  **Set up environment variables:**
    Create a `.env` file in the `server` directory and add your API key:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

### Running the Application

1.  **Start the backend server:**
    From the `server` directory, run:
    ```sh
    node server.js
    ```
    The server will start on `http://localhost:3000`.

2.  **Start the frontend client:**
    From the root project directory, run:
    ```sh
    npm run dev
    ```
    The React application will start, typically on `http://localhost:5173`.

