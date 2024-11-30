import axios from 'axios';
import { FC, Suspense, useEffect } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import AppLayout from '../page';
import Loader from '../../../common/Loader';
import DefaultLayout from '../../../layout/DefaultLayout';

const PrivateLayout: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        switch (error?.response?.status) {
          case 403:
            navigate('/403');
            break;
          default:
        }
        return Promise.reject(error);
      },
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return (
    <>
      <Suspense fallback={<Loader />}>
        <ProtectedRoute>
          <DefaultLayout>
            <Outlet />
          </DefaultLayout>
        </ProtectedRoute>
      </Suspense>
    </>
  );
};

export default PrivateLayout;
