import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProviders } from './providers';
import ErrorBoundary from './components/ErrorBoundary';


import './styles';

// Service Workerの登録
if ('serviceWorker' in navigator && import.meta.env.PROD) { // 開発環境では登録しない
  window.addEventListener('load', () => {
    const baseUrl = import.meta.env.BASE_URL;
    const swPath = `${baseUrl}service-worker.js`;
    navigator.serviceWorker.register(swPath, {
      scope: baseUrl  // スコープをベースURLに設定
    })
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
      <AppProviders>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  </StrictMode>,
);
