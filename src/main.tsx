import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PostHogProvider } from 'posthog-js/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        disable_session_recording: true,
        api_host: "https://us.i.posthog.com",
        debug: import.meta.env.MODE === "development",
      }}
    >
      <App />
    </PostHogProvider>
  </StrictMode>,
)
