import { useState } from 'react';
import { SignIn, SignUp } from '../components';

const AuthPage = () => {
    const [hasAccount, setHasAccount] = useState(true);

    const toggleHasAccount = () => {
        setHasAccount(prev => !prev);
    };
    return <main className="flex h-full justify-center items-start w-full">{hasAccount ? <SignIn toggleHasAccount={toggleHasAccount} /> : <SignUp toggleHasAccount={toggleHasAccount} />}</main>;
};

export default AuthPage;
