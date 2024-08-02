import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'
import {logout, setAll, setOnlineUser, setSocketConnection, setToken, setUser} from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo.png'
import io from 'socket.io-client'
import {getUserDetail} from "../apis/user";
import {createAxios} from "../utils/createInstance";

const Home = () => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const axiosJWT = createAxios(user, dispatch, setAll);
    const accessToken = localStorage.getItem('token')
    const fetchUserDetails = async () => {
        try {
            const userDetail = await getUserDetail(accessToken, axiosJWT);
            dispatch(setUser(userDetail?.data))
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        if (!accessToken) {
            navigate('/login')
        }
        if (!user.accessToken) {
            setToken(accessToken)
        }
        fetchUserDetails()
    }, [])

    /***socket connection */
    useEffect(() => {
        const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
            auth: {
                accessToken: accessToken
            },
        })
        dispatch(setSocketConnection(socketConnection))


        socketConnection.on('onlineUser', (data) => {
            if (data) {
                dispatch(setOnlineUser(data))
            }
        })


        return () => {
            socketConnection.disconnect()
        }
    }, [])


    const basePath = location.pathname === '/'
    return (
        <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen home'>
            <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
                <Sidebar/>
            </section>

            {/**message component**/}
            <section className={`${basePath && "hidden"}`}>
                <Outlet/>
            </section>


            <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex"}`}>
                <div>
                    <img
                        src={logo}
                        width={250}
                        alt='logo'
                    />
                </div>
                <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
            </div>
        </div>
    )
}

export default Home
