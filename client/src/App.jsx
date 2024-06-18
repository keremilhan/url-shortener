import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import Loading from './components/Loading';
import useLoading from './hooks/useLoading';

function App() {
    const { isLoading } = useLoading();

    return (
        <>
            {isLoading && <Loading />}
            <RouterProvider router={router} />;
        </>
    );
}

export default App;
