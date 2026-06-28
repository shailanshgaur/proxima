import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPageNew } from './pages/LoginPageNew';
import { SignupPageNew } from './pages/SignupPageNew';
import { HomePageNew } from './pages/HomePageNew';
import { BookingConfirmationNew } from './pages/BookingConfirmationNew';
import { AdminPage } from './pages/AdminPage';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPageNew />} />
        <Route path="/signup" element={<SignupPageNew />} />
        <Route path="/home" element={<HomePageNew />} />
        <Route path="/booking-confirmation" element={<BookingConfirmationNew />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
