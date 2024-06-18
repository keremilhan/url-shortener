import { Link } from 'react-router-dom';

const Error = () => {
    return (
        <div className="h-full text-center flex flex-col items-center justify-center">
            <img className="max-w-[600px] block mb-8" src="/images/not-found.svg" alt="not-found" />
            <h3 className="mb-2 font-bold leading-tight capitalize text-3xl">Ohh! page not found</h3>
            <p className="mt-0 mb-2 text-grey-500">We can&apos;t seem to find the page you&apos;re looking for</p>
            <Link className="text-primary-500 underline capitalize" to="/">
                Back Home
            </Link>
        </div>
    );
};

export default Error;
