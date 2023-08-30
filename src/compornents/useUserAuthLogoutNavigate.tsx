import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';

export const useUserAuthenticationLogoutNavigate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  }, [user, navigate]);
};
