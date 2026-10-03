import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-cyan-100 shadow-xl border-t-1 border-gray-400 max-h-[28px]">
            <div className="flex w-full mx-auto max-w-screen-xl p-1 items-center justify-end mt-2 text-sm font-medium text-right text-gray-500 sm:mt-0">
                <Link to="/about" className="hover:underline">
                    {' '}
                    © 2025 Arcaya Inc.{' '}
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
