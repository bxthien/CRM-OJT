import { createBrowserRouter, Outlet } from 'react-router-dom';
import privateRoutes from './routes/private';
import publicRoutes from './routes/public';
import NotFound from './components/not-found';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    errorElement: <NotFound />,
    children: [...publicRoutes, ...privateRoutes],
  },
]);

export default router;
