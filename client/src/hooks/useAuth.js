import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const navigate = useNavigate();

  const loginAs = async (username) => {
    try {
      const res = await api.post('/auth/login', { username, password: 'password123' });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      console.error('Login failed', err);
      alert('Login failed. Did you run the seed script on the backend?');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return { user, loginAs, logout };
};
