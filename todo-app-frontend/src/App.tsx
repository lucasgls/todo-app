import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { TodoApp } from './components/TodoApp';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  return (
    <div>
      {token ? (
        <TodoApp token={token} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
