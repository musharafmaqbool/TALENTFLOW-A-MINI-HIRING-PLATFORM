import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { worker } from './mocks/browser';
import { seedDatabase } from './db/seed';
import { ErrorBoundary } from './components/ErrorBoundary';

const root = document.getElementById('root');

// Show loading screen
root.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui;"><div style="text-align: center;"><div style="width: 50px; height: 50px; border: 4px solid #e5e7eb; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div><p style="color: #6b7280;">Loading TalentFlow...</p></div></div><style>@keyframes spin { to { transform: rotate(360deg); }}</style>';

async function init() {
  try {
    console.log('Step 1: Seeding database...');
    await seedDatabase();
    console.log('Step 2: Database seeded successfully');
    
    console.log('Step 3: Starting MSW...');
    console.log('MSW version:', worker);
    
    // Start MSW
    await worker.start({
      onUnhandledRequest(request, print) {
        // Ignore requests to React DevTools, etc.
        if (request.url.includes('chrome-extension')) {
          return;
        }
        console.warn('Unhandled request:', request.method, request.url);
        print.warning();
      },
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    
    console.log('✅ Step 4: MSW started successfully!');
    console.log('MSW should now be intercepting /api/* requests');
    
    // Test if handlers are loaded
    console.log('Handlers loaded:', worker.listHandlers ? worker.listHandlers().length : 'N/A');
  } catch (err) {
    console.error('❌ MSW failed to start:', err);
  }
  
  // Render app
  console.log('Step 5: Rendering app...');
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('Step 6: App rendered!');
}

init();

