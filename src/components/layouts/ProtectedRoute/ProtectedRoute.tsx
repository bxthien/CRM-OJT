import { getStorageData } from '../../../config/storage';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../../constants/auth';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/features/auth/authSlice';
import { RootState } from '../../../redux/store';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuth } = useSelector((state: RootState) => state.auth);

  const accessToken = getStorageData(ACCESS_TOKEN);
  const refreshToken = getStorageData(REFRESH_TOKEN);
  if (!accessToken && !refreshToken) {
    dispatch(logout());
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
