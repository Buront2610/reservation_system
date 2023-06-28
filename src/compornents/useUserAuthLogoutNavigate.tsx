import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from './authContext';

export const useUserAuthenticationLogoutNavigate = () => {
  const navigate = useNavigate();
  const { user } = UseAuth();

  useEffect(() => {
    if(!user) {
      navigate('/login');
    }
  }, [user, navigate]);
};
