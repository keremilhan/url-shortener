import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../lib/redux/hooks';
import { selectAuth, logout } from '../lib/redux/slices/auth';
import { Link, useNavigate, NavLink } from 'react-router-dom';

const Navbar = () => {
    const { name } = useAppSelector(selectAuth);
    const navigation = [{ text: 'Dashboard', href: '/' }];

    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSignOut = () => {
        toggleDropdown();
        dispatch(logout());
        setTimeout(() => {
            navigate('/auth');
        }, 1000);
    };

    return (
        <nav className="bg-gray-800">
            <div className="w-[90%] m-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-white text-xl font-bold">
                                Url Shortener
                            </Link>
                        </div>
                        <div className="hidden sm:block sm:ml-6">
                            <div className="flex space-x-4">
                                {navigation.map((item, index) => (
                                    <NavLink
                                        key={index}
                                        to={item.href}
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'text-white bg-gray-900 px-3 py-2 rounded-md text-md font-medium'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium'
                                        }
                                    >
                                        {item.text}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                        <div className="hidden sm:flex sm:items-center sm:ml-auto">
                            {name ? (
                                <div className="relative">
                                    <button onClick={toggleDropdown} className="flex items-center text-white focus:outline-none">
                                        <span className="mr-2">{name}</span>
                                        <img className="h-10 w-10 rounded-full border-spacing-2 border-2 border-gray" src="https://i.pravatar.cc/300" alt="Profile" />
                                    </button>
                                    {dropdownOpen && (
                                        <div className="origin-top-right absolute w-32 right-0 mt-2 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                            <Link to="#" onClick={handleSignOut} className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 text-center">
                                                Sign Out
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <NavLink
                                    to="/auth"
                                    className={({ isActive }) =>
                                        isActive
                                            ? 'text-white bg-gray-900 px-3 py-2 rounded-md text-md font-medium'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium'
                                    }
                                >
                                    Sign In
                                </NavLink>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col justify-start items-center">
                    {navigation.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.href}
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-white bg-gray-900 block px-3 py-2 rounded-md text-sm font-medium'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-sm font-medium'
                            }
                        >
                            {item.text}
                        </NavLink>
                    ))}
                    {name ? (
                        <NavLink
                            to="#"
                            onClick={handleSignOut}
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-white bg-gray-900 block px-3 py-2 rounded-md text-sm font-medium'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-sm font-medium'
                            }
                        >
                            Sign Out
                        </NavLink>
                    ) : (
                        <NavLink
                            to="/auth"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-white bg-gray-900 block px-3 py-2 rounded-md text-sm font-medium'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-sm font-medium'
                            }
                        >
                            Sign In
                        </NavLink>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
