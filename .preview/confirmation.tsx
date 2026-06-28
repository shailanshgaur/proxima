import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { BookingConfirmationNew } from '../src/pages/BookingConfirmationNew';
import '../src/styles/design-tokens.css';
(globalThis as any).process = { env: { NODE_ENV: 'development' } };
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><MemoryRouter><BookingConfirmationNew /></MemoryRouter></React.StrictMode>);
