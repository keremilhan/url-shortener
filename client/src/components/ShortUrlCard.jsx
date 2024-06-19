import { FaCopy } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ShortUrlCard = ({ handleIncrementClicks = () => {}, baseUrl, short, handleCopyShortUrl, button }) => {
    const fullShort = `${baseUrl}/${short}`;
    return (
        <div className="flex flex-col sm:flex-row items-center w-fit text-md">
            <Link
                onClick={handleIncrementClicks}
                title="Click to open"
                to={fullShort}
                target="_blank"
                type="text"
                className="border border-gray-300 rounded-s p-2 w-[150px] cursor-pointer truncate hover:bg-gray-400"
            >
                {short}
            </Link>
            <button
                type="submit"
                className="min-w-fit px-4 py-2 bg-blue-600 text-white rounded sm:rounded-e sm:rounded-l-none hover:bg-blue-700 focus:outline-none border border-blue-600"
                onClick={() => handleCopyShortUrl(fullShort)}
            >
                {button === 'text' ? 'Copy URL' : <FaCopy color="white" size={24} />}
            </button>
        </div>
    );
};

export default ShortUrlCard;
