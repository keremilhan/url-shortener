import getAuthHeader from '../utils/authHeader';
import { getUserFromLocalStorage } from '../utils/functions';
import { allUrlsEndPoint, createUrlEndPoint, deleteUrlEndPoint, updateUrlEndPoint } from '../utils/constants/endpoints';
import axios from 'axios';

export const getAllUrls = async () => {
    const user = getUserFromLocalStorage();
    if (user) {
        try {
            const response = await axios.post(allUrlsEndPoint, {}, getAuthHeader());
            return response;
        } catch (error) {
            throw error;
        }
    } else {
        return null;
    }
};

export const createUrl = async target => {
    try {
        const response = await axios.post(createUrlEndPoint, { target }, getAuthHeader());
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteUrl = async id => {
    try {
        const response = await axios.delete(`${deleteUrlEndPoint}/${id}`, getAuthHeader());
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateUrl = async (id, customShort) => {
    try {
        const response = await axios.patch(`${updateUrlEndPoint}/${id}`, { customShort }, getAuthHeader());
        return response;
    } catch (error) {
        throw error;
    }
};
