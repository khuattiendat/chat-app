import {PiUserCircle} from "react-icons/pi";
import {Link, useLocation, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {login} from "../apis/auth";
import toast from 'react-hot-toast';
import {setToken} from "../redux/userSlice";
import {useDispatch} from "react-redux";

const Login = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const handleOnChange = (e) => {
        const {name, value} = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await login(data);
            toast.success(response?.message)
            console.log(response)
            if (response.success) {
                dispatch(setToken(response?.accessToken))
                localStorage.setItem('accessToken', response?.accessToken)

                setData({
                    email: "",
                    password: "",
                })
                navigate('/')
            }
        } catch (e) {
            toast.error(e?.response?.data?.message)
        }

    }
    return (
        <div className='mt-5'>
            <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>

                <div className='w-fit mx-auto mb-2'>
                    <PiUserCircle
                        size={80}
                    />
                </div>

                <h3>Chào mừng đến với
                    <span className="font-semibold"> NOVA</span>
                </h3>

                <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>


                    <div className='flex flex-col gap-1'>
                        <label htmlFor='email'>Email :</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            placeholder='enter your email'
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data.email}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='email'>Password :</label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            placeholder='enter your password'
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data.password}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <button
                        className='bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
                    >
                        Đăng nhập
                    </button>

                </form>

                <p className='my-3 text-center'>Chưa có tài khoản?
                    <Link to={"/register"} className='hover:text-primary font-semibold'>Đăng ký</Link>
                </p>
            </div>
        </div>
    )
}
export default Login