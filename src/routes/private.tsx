import { lazy } from 'react';
import NotFound from '../components/not-found';
import Dashboard from '../pages/Dashboard/dashboard';
import Products from '../pages/Products/products';
import Calendar from '../pages/Calendar';
import Profile from '../pages/Profile';
import FormElements from '../pages/Form/FormElements';
import FormLayout from '../pages/Form/FormLayout';
import Tables from '../pages/Tables';
import Settings from '../pages/Settings';
import Chart from '../pages/Chart';
import Alerts from '../pages/UiElements/Alerts';
import Buttons from '../pages/UiElements/Buttons';
import Categories from '../pages/Category/category';
import Brand from '../pages/Brand/brand';

const PrivateLayout = lazy(
  () => import('../components/layouts/PrivateLayout/PrivateLayout'),
);

interface Route {
  element: JSX.Element;
  children?: Route[];
  path?: string;
}

const routes = [
  {
    element: <PrivateLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/products',
        element: <Products />,
      },
      {
        path: '/calendar',
        element: <Calendar />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/category',
        element: <Categories />,
      },
      {
        path: '/brand',
        element: <Brand />,
      },
      {
        path: '/forms/form-elements',
        element: <FormElements />,
      },

      {
        path: '/forms/form-layout',
        element: <FormLayout />,
      },
      {
        path: '/tables',
        element: <Tables />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: '/chart',
        element: <Chart />,
      },
      {
        path: '/ui/alerts',
        element: <Alerts />,
      },
      {
        path: '/ui/buttons',
        element: <Buttons />,
      },
    ],
  } as Route,
];

export default routes;
