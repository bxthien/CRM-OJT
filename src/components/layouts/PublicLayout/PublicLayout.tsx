import { Outlet, useNavigate } from 'react-router-dom';
import { getStorageData } from '../../../config/storage';
import { ACCESS_TOKEN } from '../../../constants/auth';
import { RootState } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const { isAuth } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (getStorageData(ACCESS_TOKEN) && isAuth) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [isAuth, getStorageData(ACCESS_TOKEN), navigate]);

  return <Outlet />;
};

export default PublicLayout;
