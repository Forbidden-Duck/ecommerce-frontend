import API from "./";

export const findMany = async (userid, token) => {
    try {
        const params = userid ? { userid } : {};
        return (
            await API.get("api/cart", {
                headers: { authorization: `Bearer ${token}` },
                params,
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const getOne = async (cartid, token) => {
    try {
        return (
            await API.get(`api/cart/${cartid}`, {
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
            await API.post("api/cart", data, {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const deleteOne = async (cartid, token) => {
    try {
        return (
            await API.delete(`api/cart/${cartid}`, {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const addItemOne = async (cartid, token, data) => {
    try {
        return (
            await API.post(`api/cart/${cartid}/items`, data, {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const updateItemOne = async (cartid, cartitemid, token, data) => {
    try {
        return (
            await API.put(`api/cart/${cartid}/items/${cartitemid}`, data, {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const deleteItemOne = async (cartid, cartitemid, token) => {
    try {
        return (
            await API.delete(`api/cart/${cartid}/items/${cartitemid}`, {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const checkout = async (cartid, paymentInfo, token) => {
    try {
        return (
            await API.post(
                `api/cart/${cartid}/checkout`,
                { paymentInfo },
                {
                    headers: { authorization: `Bearer ${token}` },
                }
            )
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};
