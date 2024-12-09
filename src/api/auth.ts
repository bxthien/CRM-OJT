import { useDispatch } from 'react-redux';
import instanceAxios from '../config/axios';
import { removeStorageData, setStorageData } from '../config/storage';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/auth';
import { SignInResponse, User } from '../interface/auth';
import { login, logout } from '../redux/features/auth/authSlice';
import { setUser } from '../redux/features/auth/userSlice';

export interface SignInPayload {
  email: string;
  password: string;
}

export const useSignIn = () => {
  const dispatchAuth = useDispatch();

  const signIn = async (params: SignInPayload): Promise<SignInResponse> => {
    try {
      const { data: response } = await instanceAxios.post<SignInResponse>(
        '/auth/login',
        params,
      );

      // Kiểm tra vai trò của user
      const allowedRoles = ['admin', 'seller']; // Các vai trò được phép
      if (!allowedRoles.includes(response.roles)) {
        throw new Error('User role is not authorized to access.');
      }

      if (response.access_token) {
        // Lưu token vào localStorage
        setStorageData(ACCESS_TOKEN, response.access_token);
        setStorageData(REFRESH_TOKEN, response.refresh_token);

        // Cập nhật trạng thái đăng nhập
        dispatchAuth(login());
        return response; // Trả về dữ liệu nếu thành công
      }

      return response;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  return { signIn };
};


export const useLogout = () => {
  const dispatch = useDispatch();

  const logOut = () => {
    removeStorageData(ACCESS_TOKEN);
    removeStorageData(REFRESH_TOKEN);

    dispatch(logout());
  };

  return { logOut };
};

export const useGetMe = () => {
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const response = await instanceAxios.get<User>('user/profile');
      if (response.data) {
        dispatch(setUser(response.data));
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  return { fetchUser };
};
