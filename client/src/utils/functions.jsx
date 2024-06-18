export const validateNameRequirements = value => {
    if (!value) {
        return 'Name field can not be empty.';
    }

    if (value.length < 3) {
        return 'Name must be at least 3 characters long.';
    }
    if (value.length > 50) {
        return 'Name cannot be more than 50 characters long.';
    }

    return;
};
export const validateEmailRequirements = value => {
    if (!value) {
        return 'Email field can not be empty.';
    }
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

    if (!emailRegex.test(value)) {
        return 'Please provide a valid email.';
    }
};
// Validation function for email
export const validatePasswordRequirements = value => {
    if (!value) {
        return 'Email field can not be empty.';
    }
    const errors = [];

    if (value.length < 6) {
        errors.push('6 characters');
    }
    if (!/(?=.*[a-z])/.test(value)) {
        errors.push('one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(value)) {
        errors.push('one uppercase letter');
    }
    if (!/(?=.*\d)/.test(value)) {
        errors.push('one digit');
    }

    if (errors.length > 0) {
        return `Password must include at least ${errors.join(', ')}.`;
    }
};

export const saveUserToLocalStorage = user => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const removeUserFromLocalStorage = () => {
    localStorage.removeItem('user');
};

export const getUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isSafari = () => {
    const userAgent = navigator.userAgent;
    const chromeAgent = userAgent.includes('Chrome');
    let safariAgent = userAgent.includes('Safari');

    if (chromeAgent && safariAgent) safariAgent = false;

    return safariAgent;
};

export const isValidUrl = url => {
    const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$',
        'i'
    );
    return !!urlPattern.test(url);
};

export const formatUrl = url => {
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    return url;
};
