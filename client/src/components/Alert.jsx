import { MdError } from 'react-icons/md';
import { IoWarning } from 'react-icons/io5';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleInfo } from 'react-icons/fa6';

const Alert = ({ type, message }) => {
    const alertClasses = `w-[100%] px-4 py-3 ps-3 rounded-md relative flex gap-2 items-center mt-2 ${getTypeClasses(type)}`;
    return (
        <div className={alertClasses} role="alert">
            <div>{getIcon(type)}</div>
            <span className="block sm:inline text-sm">{message}</span>
        </div>
    );
};

const getTypeClasses = type => {
    switch (type) {
        case 'success':
            return 'bg-green-100 border-green-700 border-s-8 text-green-700';
        case 'info':
            return 'bg-blue-100 border-blue-700 border-s-8 text-blue-700';
        case 'warning':
            return 'bg-yellow-100 border-yellow-700 border-s-8 text-yellow-700';
        case 'danger':
            return 'bg-red-100 border-red-700 border-s-8 text-red-700';
        default:
            return '';
    }
};
const getIcon = type => {
    switch (type) {
        case 'success':
            return <FaCheckCircle size={21} />;
        case 'info':
            return <FaCircleInfo size={21} />;
        case 'warning':
            return <IoWarning size={25} />;
        case 'danger':
            return <MdError size={25} />;
        default:
            return '';
    }
};

export default Alert;
