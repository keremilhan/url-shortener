import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onCancel, onConfirm, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg relative">
                {children}
                <div className="flex justify-end mt-8">
                    <button className="text-red-600 hover:text-red-900 bg-gray-100 px-4 py-2 rounded-md mr-2" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md" onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
