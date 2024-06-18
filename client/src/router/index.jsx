import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import { AuthPage, Error, Home } from '../pages';
import PublicRoute from '../pages/PublicRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'auth',
                element: <PublicRoute />,
                children: [{ index: true, element: <AuthPage /> }],
            },
        ],
    },
]);
