import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../lib/redux/hooks';
import { selectAuth } from '../lib/redux/slices/auth';

const PublicRoute = () => {
    const { accessToken } = useAppSelector(selectAuth);
    return accessToken ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
