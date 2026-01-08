import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import { QuizProvider } from './context/QuizContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './styles';

// Service Workerの登録
if ('serviceWorker' in navigator && import.meta.env.PROD) { // 開発環境では登録しない
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <QuizProvider>
          <App />
        </QuizProvider>
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>,
);
