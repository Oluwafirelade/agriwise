# AgriWise Frontend

A multilingual agricultural advisory chatbot frontend built with React, TypeScript, and Vite. This application provides farmers with AI-powered advice on crop management, pest control, and farming practices in multiple Nigerian languages (English, Hausa, Igbo, Yoruba, and Pidgin).

## Features

- **Multilingual Support**: Automatic language detection and translation for Hausa, Igbo, Yoruba, Pidgin, and English.
- **Chat Interface**: Interactive chat for asking agricultural questions and receiving advice.
- **User Authentication**: Firebase-based login and signup for personalized experience.
- **Responsive Design**: Mobile-friendly UI with dark/light theme toggle.
- **Real-time Advice**: Integrates with a FastAPI backend powered by Hugging Face models for accurate farming advice.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context for authentication and theme
- **Backend Integration**: Axios for API calls to FastAPI backend
- **Authentication**: Firebase Auth
- **Icons**: Lucide React
- **Routing**: React Router

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (buttons, inputs, etc.)
│   ├── chat/         # Chat interface components
│   ├── landing/      # Landing page sections (hero, features, etc.)
│   ├── layout/       # Header, footer, navigation
│   └── shared/       # Shared components like language selector, theme toggle
├── contexts/         # React contexts for auth and theme
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries (firebase, translations, etc.)
├── pages/            # Page components (Index, Chat, Login, etc.)
├── assets/           # Static assets (images, icons)
└── main.tsx          # App entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with authentication enabled
- Backend API (FastAPI) running

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SilvanusCharles/agriwise-frontend.git
   cd agriwise-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_BASE_URL=https://your-backend-url.com
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

1. **Landing Page**: Users land on an informative page with features, how it works, and language options.
2. **Authentication**: Users can sign up or log in using Firebase Auth.
3. **Chat Interface**: Authenticated users can ask questions in their preferred language. The app detects the language automatically and translates queries to English for backend processing, then translates responses back.
4. **Language Selection**: Manual language override available via the language selector.
5. **Theme Toggle**: Switch between light and dark modes.

## API Integration

The frontend communicates with a FastAPI backend via the `/api/agricultural-advice` endpoint. Requests include:
- `query`: User's question
- `language`: Detected or selected language code

Responses include:
- `response`: Translated advice
- `confidence`: Model confidence score
- `language`: Response language

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## Deployment

This app can be deployed to platforms like Vercel, Netlify, or GitHub Pages. For Vercel:

1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

For static hosting, build the app and serve the `dist/` folder.

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.