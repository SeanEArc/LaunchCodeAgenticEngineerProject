import { useRef } from 'react';

const ConfirmationModal = ({ onClose, onConfirm }) => {
    const modalRef = useRef();

    const closeModal = event => {
        if (modalRef.current === event.target) onClose();
    };

    const handleSubmit = event => {
        event.preventDefault();
        onConfirm();
    };

    return (
        <div
            ref={modalRef}
            onClick={closeModal}
            className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center"
        >
            <div className="grid grid-row-6 bg-zinc-50 p-2 rounded-lg shadow-xl py-8 px-8 border min-w-[300px] max-w-[600px]">
                <h2 className="text-xl font-semibold text-center mb-5">
                    {' '}
                    Are you sure you want to delete this entry?{' '}
                </h2>

                <button
                    onClick={handleSubmit}
                    className="mx-4 px-4 m-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Delete Permanently
                </button>

                <button
                    onClick={onClose}
                    className="mx-4 m-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    {' '}
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ConfirmationModal;
