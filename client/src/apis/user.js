import axios from "axios";

export const getUserDetail = async (accessToken, axiosJWT) => {
    const URL = '/user-details'
    const response = await axiosJWT.get(URL, {
        headers: {
            token: `Bearer ${accessToken}`
        },
        withCredentials: true
    })
    return response?.data
}
export const updateUser = async (data, accessToken, axiosJWT) => {
    const URL = '/update-user'
    const response = await axiosJWT.post(URL, data, {
        headers: {
            token: `Bearer ${accessToken}`
        },
        withCredentials: true
    })
    return response?.data
}