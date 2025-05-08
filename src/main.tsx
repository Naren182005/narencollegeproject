import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { startWorker } from './mocks/browser'

// Start the mock service worker
if (process.env.NODE_ENV === 'development') {
  startWorker();
}

createRoot(document.getElementById("root")!).render(<App />);
