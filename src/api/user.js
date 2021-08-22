import API from "./";

export const getMany = async (token) => {
    try {
        return (
            await API.get(`api/user`, {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const getOne = async (userid, token) => {
    try {
        return (
            await API.get(`api/user/${userid}`, {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const updateOne = async (userid, token, data) => {
    try {
        return (
            await API.put(`api/user/${userid}`, data, {
                headers: { authorization: `Bearer ${token}` },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const deleteOne = async (userid, token, password) => {
    try {
        return (
            await API.delete(`api/user/${userid}`, {
                headers: { authorization: `Bearer ${token}` },
                data: {
                    password,
                },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};
