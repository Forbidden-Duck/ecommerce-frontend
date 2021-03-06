import API from "./";

export const register = async (data) => {
    try {
        return (await API.post("auth/register", data)).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const login = async (data) => {
    try {
        return (await API.post("auth/login", data)).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const google = async (token) => {
    try {
        return (
            await API.post("auth/google", undefined, {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })
        ).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const refreshtoken = async () => {
    try {
        return (await API.post("auth/refresh_token")).data;
    } catch (err) {
        throw err.response.data;
    }
};

export const logout = async () => {
    try {
        return (await API.post("auth/logout")).data;
    } catch (err) {
        throw err.response.data;
    }
};
