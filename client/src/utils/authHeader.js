import { getUserFromLocalStorage } from './functions';

const getAuthHeader = () => {
    const user = getUserFromLocalStorage();
    const headers = {};

    if (user) {
        headers.authorization = `Bearer ${user.accessToken}`;
    }

    return { headers };
};

export default getAuthHeader;
