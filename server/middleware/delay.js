module.exports = function (delayInMilliseconds) {
    return function (req, res, next) {
        setTimeout(next, delayInMilliseconds);
    };
};
