const generateUniqueId = (length = 7) => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
};

const isValidUrl = url => {
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

const formatUrl = url => {
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    return url;
};

module.exports = {
    isValidUrl,
    formatUrl,
    generateUniqueId,
};
