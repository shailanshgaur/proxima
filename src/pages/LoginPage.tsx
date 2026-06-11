import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneLogin } from '../components/Auth/PhoneLogin';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Zing Connect</h1>
        <p>Book local services in your society</p>
      </div>

      <PhoneLogin onSuccess={() => navigate('/home')} onSignupClick={() => navigate('/signup')} />
    </div>
  );
};
