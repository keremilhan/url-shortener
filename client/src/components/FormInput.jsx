import { useState } from 'react';
import { createUrl } from '../services/urlService';
import { formatUrl, getUserFromLocalStorage, isValidUrl } from '../utils/functions';
import Alert from './Alert';
import useLoading from '../hooks/useLoading';
import { baseUrl } from '../utils/constants/endpoints';
import { Link } from 'react-router-dom';
import ShortUrlCard from './ShortUrlCard';

const FormInput = ({ setUrls }) => {
    const [data, setData] = useState(null);
    const [newLongUrl, setNewLongUrl] = useState('');
    const [alert, setAlert] = useState(null);

    const { showLoading, hideLoading } = useLoading();
    const user = getUserFromLocalStorage();

    const handleNewLongUrlChange = event => {
        setNewLongUrl(event.target.value.trim());
    };

    const handleSetAlert = (type, message, duration) => {
        setAlert({ type, message });
        setTimeout(() => {
            setAlert(null);
        }, duration);
    };

    const handleNewUrlSubmit = async event => {
        event.preventDefault();
        const testUrl = formatUrl(newLongUrl.trim());
        if (!isValidUrl(testUrl)) {
            return handleSetAlert('danger', 'Invalid URL', 3000);
        }
        if (newLongUrl.length < 1) {
            return handleSetAlert('danger', 'Please provide URL', 3000);
        }
        if (newLongUrl.length > 150) {
            return handleSetAlert('danger', 'Url cannot be more than 150 characters long.', 3000);
        }
        showLoading();
        try {
            const result = await createUrl(newLongUrl);
            if (result.status === 201) {
                handleSetAlert('success', result.data.message, 3000);
                setData(result.data.url);
                if (user) {
                    setUrls(prev => [result.data.url, ...prev]);
                }
                setNewLongUrl('');
            }
        } catch (error) {
            console.error(error);
            handleSetAlert('danger', error.response.data.msg, 3000);
        } finally {
            hideLoading();
        }
    };

    const handleCopyShortUrl = link => {
        if (link) {
            navigator.clipboard.writeText(link).then(() => {
                handleSetAlert('success', 'Short URL copied to clipboard!', 3000);
            });
        }
    };

    return (
        <div className="overflow-x-auto w-full lg:w-1/3 m-auto">
            <div className="flex flex-col justify-center gap-4">
                {!user && (
                    <div className="h-16 my-4">
                        {' '}
                        <Alert
                            type="warning"
                            message="Customizing short URLs and accessing your dashboard requires an account. Once logged in, you'll be able to personalize your short URLs to your preference."
                        />
                    </div>
                )}
                <div className="h-16 mb-1">{alert && <Alert type={alert.type} message={alert.message} />}</div>
            </div>
            <form className="my-2" onSubmit={handleNewUrlSubmit}>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="text"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-300 w-full"
                        placeholder="Enter your long URL"
                        value={newLongUrl}
                        onChange={handleNewLongUrlChange}
                    />
                    <button type="submit" className="w-full sm:min-w-fit sm:w-fit px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none">
                        Create Short URL
                    </button>
                </div>
            </form>
            {!user && data?.short && (
                <div className="mb-4 text-md">
                    <ShortUrlCard baseUrl={baseUrl} short={data.short} handleCopyShortUrl={handleCopyShortUrl} button={'text'} />
                    <div className="flex justify-start align-center gap-1 mt-2">
                        <p>Target URL:</p>
                        <Link to={data?.target} target="_blank" className="text-blue-600 hover:underline cursor-pointer">
                            {data?.target}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormInput;
