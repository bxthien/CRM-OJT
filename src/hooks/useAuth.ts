import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useAuth = () => {
  return useSelector((state: RootState) => state.auth.isAuth);
};
