
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Marketing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to homepage since marketing content is now there
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default Marketing;
