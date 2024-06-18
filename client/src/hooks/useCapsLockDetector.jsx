import { useEffect, useState } from 'react';

const useCapsLockDetector = () => {
    const [capsLockOn, setCapsLockOn] = useState(false);

    useEffect(() => {
        const handleKeyPress = e => {
            setCapsLockOn(e.getModifierState('CapsLock'));
        };

        const handleKeyUp = e => {
            setCapsLockOn(e.getModifierState('CapsLock'));
        };

        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return capsLockOn;
};

export default useCapsLockDetector;
