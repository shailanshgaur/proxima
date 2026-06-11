import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupFlow } from '../components/Auth/SignupFlow';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Zing Connect</h1>
        <p>Join your society's marketplace</p>
      </div>

      <SignupFlow onSuccess={() => navigate('/home')} onLoginClick={() => navigate('/login')} />
    </div>
  );
};
