import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import { QuizProvider } from './context/QuizContext';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import './styles';

// Service Workerの登録
if ('serviceWorker' in navigator && import.meta.env.PROD) { // 開発環境では登録しない
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <QuizProvider>
            <App />
          </QuizProvider>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);
