import axios from "axios";
import {jwtDecode as jwt_decode} from 'jwt-decode';

const URL = process.env.REACT_APP_BACKEND_URL
const refreshToken = async () => {
    try {
        const res = await axios.post(`${URL}/api/refresh-token`, {}, {
                withCredentials: true
            }
        )
        return res.data;
    } catch (err) {
        console.log(err);
    }
};
export const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create({
        baseURL: `${URL}/api`,
    });
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwt_decode(user?.accessToken);
            if (decodedToken.exp < date.getTime() / 1000) {
                const dataRefresh = await refreshToken();
                console.log("dataRefresh", user)
                let newUserData = {
                    ...user,
                    accessToken: dataRefresh?.accessToken,
                }
                dispatch(stateSuccess(newUserData));
                config.headers["token"] = "Bearer " + dataRefresh?.accessToken;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );
    return newInstance;
};