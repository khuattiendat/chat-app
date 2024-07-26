import axios from 'axios';

export const login = async (data) => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/login`
    const response = await axios.post(URL, data, {
        withCredentials: true
    })
    return response.data;
}
export const register = async (data) => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`
    const response = await axios.post(URL, data)
    return response.data;
}
export const logoutDB = async (accessToken, axiosJWT) => {
    console.log(accessToken)
    const res = await axiosJWT.post("/logout", {}, {
        headers: {
            token: `Bearer ${accessToken}`
        }
    })
    return res.data
}