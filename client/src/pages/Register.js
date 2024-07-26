import React, {useState} from 'react'
import {IoClose} from "react-icons/io5";
import {Link, useNavigate} from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';
import {register} from "../apis/auth";
import Loading from "../components/Loading";

const Register = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        profile_pic: ""
    })
    const [uploadPhoto, setUploadPhoto] = useState("")
    const navigate = useNavigate()

    const handleOnChange = (e) => {
        const {name, value} = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0]

        const uploadPhoto = await uploadFile(file)

        setUploadPhoto(file)

        setData((preve) => {
            return {
                ...preve,
                profile_pic: uploadPhoto?.url
            }
        })
    }
    const handleClearUploadPhoto = (e) => {
        e.stopPropagation()
        e.preventDefault()
        setUploadPhoto(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setLoading(true)
            const response = await register(data)

            toast.success(response?.message)

            if (response.success) {
                setData({
                    name: "",
                    email: "",
                    password: "",
                    profile_pic: ""
                })
                navigate('/login')
                setLoading(false)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            toast.error(error?.response?.data?.message)
        }
    }


    return (
        <div className='mt-5'>
            <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
                <h3>Chào mừng đến với
                    <span className="font-semibold"> NOVA</span>
                </h3>

                <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='name'>Họ tên :</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            placeholder='enter your name'
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data.name}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

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
                        <label htmlFor='password'>Password :</label>
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

                    <div className='flex flex-col gap-1'>
                        <label htmlFor='profile_pic'>Photo :

                            <div
                                className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
                                <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                                    {
                                        uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"
                                    }
                                </p>
                                {
                                    uploadPhoto?.name && (
                                        <button className='text-lg ml-2 hover:text-red-600'
                                                onClick={handleClearUploadPhoto}>
                                            <IoClose/>
                                        </button>
                                    )
                                }

                            </div>

                        </label>

                        <input
                            type='file'
                            id='profile_pic'
                            name='profile_pic'
                            className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
                            onChange={handleUploadPhoto}
                        />
                    </div>


                    <button
                        className='bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
                    >
                        {
                            loading ? <Loading/> : "Register"
                        }
                    </button>

                </form>

                <p className='my-3 text-center'>Bạn đã có tài khoản? <Link to={"/login"}
                                                                           className='hover:text-primary font-semibold'>Đăng
                    nhập</Link>
                </p>
            </div>
        </div>
    )
}

export default Register
