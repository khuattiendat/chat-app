import axios from "axios";
import {jwtDecode as jwt_decode} from 'jwt-decode';

const refreshToken = async () => {
    try {
        const res = await axios.post("http://localhost:8080/api/refresh-token"
        )
        return res.data.data;
    } catch (err) {
        console.log(err);
    }
};
export const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create({
        baseURL: "http://localhost:8080/api",
    });
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwt_decode(user?.accessToken);
            if (decodedToken.exp < date.getTime() / 1000) {
                const dataRefresh = await refreshToken();
                console.log("dataRefresh", dataRefresh)
                let newUserData = {
                    ...(user),
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