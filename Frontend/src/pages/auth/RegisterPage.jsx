import React from 'react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { RegisterForm } from '../../components/auth/RegisterForm';

export const RegisterPage = ({ onNavigate, onSuccess, initialUsername }) => {
  return (
    <AuthLayout onNavigate={onNavigate}>
      <RegisterForm 
        initialUsername={initialUsername}
        onNavigateLogin={(uname) => onNavigate('/login', { username: uname })} 
        onSuccess={onSuccess} 
      />
    </AuthLayout>
  );
};

export default RegisterPage;
