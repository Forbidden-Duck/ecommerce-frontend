import API from "./";

export const findMany = async (filter, token) => {
    try {
        return (
            await API.get("api/order", {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const getOne = async (orderid, token) => {
    try {
        return (
            await API.get(`api/order/${orderid}`, {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};
