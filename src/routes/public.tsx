import PublicLayout from '../components/layouts/PublicLayout/PublicLayout';
import Login from '../pages/Login';

const routes = [
  {
    element: <PublicLayout />,
    children: [{ path: '/login', element: <Login /> }],
  },
];

export default routes;
