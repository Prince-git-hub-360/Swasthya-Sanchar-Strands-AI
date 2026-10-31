import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { LoginForm } from '../../components/auth/LoginForm';

export const LoginPage = ({ onNavigate, onSuccess, initialUsername }) => {
  return (
    <AuthLayout onNavigate={onNavigate}>
      <LoginForm 
        initialUsername={initialUsername}
        onNavigateRegister={(uname) => onNavigate('/register', { username: uname })} 
        onSuccess={onSuccess} 
      />
    </AuthLayout>
  );
};

export default LoginPage;
