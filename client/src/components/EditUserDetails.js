import React, {useEffect, useRef, useState} from 'react'
import Avatar from './Avatar'
import uploadFile from '../helpers/uploadFile'
import Divider from './Divider'
import toast from 'react-hot-toast'
import {useDispatch} from 'react-redux'
import {setAll, setUser} from '../redux/userSlice'
import {updateUser} from "../apis/user";
import {createAxios} from "../utils/createInstance";
import Loading from "./Loading";


const EditUserDetails = ({onClose, user}) => {
    const accessToken = localStorage.getItem('token')
    const dispatch = useDispatch()
    const axiosJWT = createAxios(user, dispatch, setAll);
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        name: user?.user,
        profile_pic: user?.profile_pic,
        phone: user?.phone
    })
    const uploadPhotoRef = useRef()

    useEffect(() => {
        setData((preve) => {
            return {
                ...preve,
                ...user
            }
        })
    }, [user])

    const handleOnChange = (e) => {
        const {name, value} = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const handleOpenUploadPhoto = (e) => {
        e.preventDefault()
        e.stopPropagation()

        uploadPhotoRef.current.click()
    }
    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0]
        setLoading(true)
        const uploadPhoto = await uploadFile(file)
        setLoading(false)

        setData((preve) => {
            return {
                ...preve,
                profile_pic: uploadPhoto?.url
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            let payload = {
                name: data.name,
                profile_pic: data.profile_pic,
                phone: data.phone
            }
            const response = await updateUser(payload, accessToken, axiosJWT)
            if (response.success) {
                dispatch(setUser(response.data))
                onClose()
            }
            toast.success(response?.message)
        } catch (error) {
            console.log(error.message)
            toast.error("Something went wrong!")
        }
    }
    return (
        <div
            className='edit__user fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
            <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
                <h2 className='font-semibold'>Profile Details</h2>
                <p className='text-sm '>Edit user details</p>

                <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='name'>Name:</label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            value={data.name}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 focus:outline-primary border-0.5'
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='name'>Số điện thoại:</label>
                        <input
                            type='text'
                            name='phone'
                            id='phone'
                            value={data?.phone}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 focus:outline-primary border-0.5'
                        />
                    </div>

                    <div>
                        <div>Photo:</div>
                        <div className='my-1 flex items-center gap-4'>
                            {
                                loading ? <Loading/> : <Avatar
                                    width={40}
                                    height={40}
                                    imageUrl={data?.profile_pic}
                                    name={data?.name}
                                />
                            }

                            <label htmlFor='profile_pic'>
                                <button className='font-semibold' onClick={handleOpenUploadPhoto}>Change Photo</button>
                                <input
                                    type='file'
                                    id='profile_pic'
                                    className='hidden'
                                    onChange={handleUploadPhoto}
                                    ref={uploadPhotoRef}
                                />
                            </label>
                        </div>
                    </div>

                    <Divider/>
                    <div className='flex gap-2 w-fit ml-auto '>
                        <button onClick={onClose}
                                className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel
                        </button>
                        <button onClick={handleSubmit}
                                className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary'>Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default React.memo(EditUserDetails)
