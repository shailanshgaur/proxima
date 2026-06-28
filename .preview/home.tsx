import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { HomePageNew } from '../src/pages/HomePageNew';
import '../src/styles/design-tokens.css';
(globalThis as any).process = { env: { NODE_ENV: 'development' } };
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><MemoryRouter><HomePageNew /></MemoryRouter></React.StrictMode>);
