import API from "./";

export const getMany = async (token) => {
    try {
        return (
            await API.get("api/product", {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const getOne = async (productid, token) => {
    try {
        return (
            await API.get(`api/product/${productid}`, {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const createOne = async (token, data) => {
    try {
        return (
            await API.post(`api/product`, data, {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const updateOne = async (productid, token, data) => {
    try {
        return (
            await API.put(`api/product/${productid}`, data, {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const deleteOne = async (productid, token) => {
    try {
        return (
            await API.delete(`api/product/${productid}`, {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};
