import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useUser = () => {
  return useSelector((state: RootState) => state.user.user);
};
