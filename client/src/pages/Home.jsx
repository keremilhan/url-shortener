import { useEffect, useState } from 'react';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import { RiEdit2Fill } from 'react-icons/ri';
import Modal from '../components/Modal';
import { deleteUrl, getAllUrls, updateUrl } from '../services/urlService';
import Alert from '../components/Alert';
import FormInput from '../components/FormInput';
import useLoading from '../hooks/useLoading';
import ShortUrlCard from '../components/ShortUrlCard';
import { baseUrl } from '../utils/constants/endpoints';
import { getUserFromLocalStorage } from '../utils/functions';

const Home = () => {
    const [urls, setUrls] = useState(null);
    const [editableUrlIndex, setEditableUrlIndex] = useState(null);
    const [newShortUrl, setNewShortUrl] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [urlToDelete, setUrlToDelete] = useState(null);
    const [urlToEdit, setUrlToEdit] = useState(null);
    const [alert, setAlert] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [urlsPerPage] = useState(10);
    const { showLoading, hideLoading } = useLoading();
    const user = getUserFromLocalStorage();

    const handleSetAlert = (type, message, duration) => {
        setAlert({ type, message });
        setTimeout(() => {
            setAlert(null);
        }, duration);
    };

    const formatDate = isoDate => {
        const date = new Date(isoDate);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };

    const handleEditClick = (index, shortUrl) => {
        setEditableUrlIndex(index);
        setNewShortUrl(shortUrl);
    };

    const handleInputChange = event => {
        setNewShortUrl(event.target.value.trim());
    };

    const handleCancelClick = () => {
        setEditableUrlIndex(null);
        setNewShortUrl('');
    };

    const handleSubmit = async () => {
        setEditableUrlIndex(null);
        setNewShortUrl('');
        const editedShortUrl = urls.find(url => url._id === urlToEdit).short;
        if (newShortUrl === editedShortUrl) {
            return;
        }
        if (newShortUrl.length < 3) {
            return handleSetAlert('danger', 'Short url must be at least 3 characters long.', 3000);
        } else if (newShortUrl.length > 20) {
            return handleSetAlert('danger', 'Short url cannot be more than 20 characters long.', 3000);
        }
        showLoading();
        try {
            const result = await updateUrl(urlToEdit, newShortUrl);
            if (result.status === 200) {
                handleSetAlert('success', result.data.message, 3000);
                setUrls(urls?.map(url => (url._id === urlToEdit ? { ...url, short: newShortUrl } : url)));
            }
        } catch (error) {
            handleSetAlert('danger', error.response.data.msg, 3000);
        } finally {
            hideLoading();
        }
    };

    const handleDeleteClick = index => {
        setUrlToDelete(urls[index]._id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowDeleteModal(false);
        showLoading();
        try {
            const result = await deleteUrl(urlToDelete);
            if (result.status === 200) {
                handleSetAlert('success', result.data.message, 3000);
                setUrls(urls?.filter(url => url._id !== urlToDelete));
            }
        } catch (error) {
            handleSetAlert('danger', error.response.data.msg, 3000);
        } finally {
            hideLoading();
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleCopyShortUrl = link => {
        if (link) {
            navigator.clipboard.writeText(link).then(() => {
                handleSetAlert('success', 'Short URL copied to clipboard!', 3000);
            });
        }
    };
    const handleIncrementClicks = id => {
        setUrls(urls?.map(url => (url._id === id ? { ...url, clicks: url.clicks + 1 } : url)));
    };

    useEffect(() => {
        const fetchData = async () => {
            showLoading();
            try {
                const result = await getAllUrls();
                setUrls(result.data.urls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (err) {
                console.error(err);
                handleSetAlert('danger', err.response.data.msg, 3000);
            } finally {
                hideLoading();
            }
        };
        if (user) {
            fetchData();
        }
    }, []);

    // Get current URLs
    const indexOfLastUrl = currentPage * urlsPerPage;
    const indexOfFirstUrl = indexOfLastUrl - urlsPerPage;
    const currentUrls = urls?.slice(indexOfFirstUrl, indexOfLastUrl);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    let tableComponent = urls ? (
        <div className="shadow border-b overflow-auto border-gray-200 sm:rounded-lg w-full">
            <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr className="h-[70px]">
                        <th scope="col" className="px-6 py-3 text-left text-md font-medium text-black uppercase tracking-wider">
                            Created Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-md font-medium text-black uppercase tracking-wider">
                            Clicks
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-md font-medium text-black uppercase tracking-wider">
                            Target URL
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-md font-medium text-black uppercase tracking-wider">
                            Short URL
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-md font-medium text-black uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentUrls?.length > 0 ? (
                        currentUrls?.map((url, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 h-[70px] hover:bg-gray-200' : 'bg-white h-[70px] hover:bg-gray-200'}>
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(url.createdAt)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{url.clicks}</td>
                                <td className="px-6 py-4 whitespace-nowrap max-w-[250px] truncate">{url.target}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editableUrlIndex === index ? (
                                        <input
                                            type="text"
                                            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:border-blue-300 w-fit h-[42px]"
                                            value={newShortUrl}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <ShortUrlCard
                                            handleIncrementClicks={() => handleIncrementClicks(url._id)}
                                            baseUrl={baseUrl}
                                            short={url.short}
                                            handleCopyShortUrl={handleCopyShortUrl}
                                            button={'icon'}
                                        />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {editableUrlIndex === index ? (
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                type="button"
                                                className="h-full inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                onClick={() => handleSubmit(index)}
                                            >
                                                Submit
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center py-1 px-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                onClick={handleCancelClick}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                type="button"
                                                className="text-indigo-600 hover:text-indigo-900"
                                                onClick={() => {
                                                    handleEditClick(index, url.short);
                                                    setUrlToEdit(url._id);
                                                }}
                                            >
                                                <RiEdit2Fill size={25} />
                                            </button>
                                            <button type="button" className="text-red-600 hover:text-red-900" onClick={() => handleDeleteClick(index)}>
                                                <RiDeleteBin6Fill size={25} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className="h-[70px]">
                            <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center">
                                You have no URLs
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {currentUrls?.length > 0 && <Pagination urlsPerPage={urlsPerPage} totalUrls={urls?.length} paginate={paginate} currentPage={currentPage} />}
        </div>
    ) : null;

    return (
        <div className="overflow-x-auto">
            <FormInput setUrls={setUrls} />
            <div className="h-16 mt-2">{alert && <Alert type={alert.type} message={alert.message} />}</div>
            {tableComponent}
            <Modal isOpen={showDeleteModal} onCancel={handleCancelDelete} onConfirm={handleConfirmDelete}>
                <p className="text-lg mb-4">Are you sure you want to delete this URL?</p>
            </Modal>
        </div>
    );
};

const Pagination = ({ urlsPerPage, totalUrls, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalUrls / urlsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between p-4 border-t border-gray-200" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                Showing{' '}
                <span className="font-semibold text-gray-900">
                    {(currentPage - 1) * urlsPerPage + 1}-{Math.min(currentPage * urlsPerPage, totalUrls)}
                </span>{' '}
                of <span className="font-semibold text-gray-900">{totalUrls}</span>
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                <li>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700${
                            currentPage === 1 ? 'cursor-not-allowed pointer-events-none' : ''
                        }`}
                    >
                        Previous
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number}>
                        <button
                            onClick={() => paginate(number)}
                            className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${
                                currentPage === number ? 'bg-blue-50 text-blue-600' : ''
                            }`}
                        >
                            {number}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
                            currentPage === Math.ceil(totalUrls / urlsPerPage) ? 'cursor-not-allowed pointer-events-none' : ''
                        }`}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Home;
