import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <main>
            <Navbar />
            <section className="h-full w-full p-10 pt-5">
                <Outlet />
            </section>
        </main>
    );
};

export default Layout;
