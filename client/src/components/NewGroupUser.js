import {IoClose, IoSearchOutline} from "react-icons/io5";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createAxios} from "../utils/createInstance";
import {setAll} from "../redux/userSlice";
import {searchUser} from "../apis/user";
import toast from "react-hot-toast";
import uploadFile from "../helpers/uploadFile";
import {useNavigate} from "react-router-dom";

const NewGroupUser = ({onClose}) => {
    const user = useSelector(state => state?.user)
    const socketConnection = useSelector(state => state?.user?.socketConnection)
    const [searchUserData, setSearchUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingPhoto, setLoadingPhoto] = useState(false)
    const [search, setSearch] = useState("")
    const [name, setName] = useState("")
    const [avatar, setAvatar] = useState("")
    const [selectedUser, setSelectedUser] = useState({
        id: [],
        name: []
    })
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const axiosJWT = createAxios(user, dispatch, setAll);
    const uploadPhotoRef = useRef()
    const handleOpenUploadPhoto = (e) => {
        e.preventDefault()
        e.stopPropagation()

        uploadPhotoRef.current.click()
    }

    const handleChange = (e) => {
        let value = e.target.value
        if (e.target.checked) {
            setSelectedUser({
                id: [...selectedUser.id, value],
                name: [...selectedUser.name, e.target.dataset.name]
            })
        } else {
            setSelectedUser({
                id: selectedUser.id.filter(item => item !== value),
                name: selectedUser.name.filter(item => item !== e.target.dataset.name)
            })
        }
    }
    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0]
        setLoadingPhoto(true)
        const uploadPhoto = await uploadFile(file)
        setLoadingPhoto(false)
        setAvatar(uploadPhoto?.url);

    }
    const handleSearchUser = async () => {
        try {
            setLoading(true)
            let data = {
                search: search,
                userId: user?._id
            }
            const response = await searchUser(data, user?.accessToken, axiosJWT)
            setLoading(false)

            setSearchUser(response?.data);

        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }
    const handleSubmit = async () => {
        if (selectedUser.id.length === 0) {
            return toast.error('Vui lòng chọn người dùng để tạo nhóm mới!')
        }
        if (!name) {
            return toast.error('Vui lòng nhập tên nhóm!')
        }
        let data = {
            conversationType: 'group',
            conversationName: name ? name : selectedUser.name.join(', '),
            avatar: avatar,
            members: Array.from(selectedUser.id).concat(user?._id),
            sender: user?._id,
            receiver: Array.from(selectedUser.id).concat(user?._id),
        }
        if (socketConnection) {
            socketConnection.emit('new-group', data)
            toast.success('Tạo nhóm mới thành công!')
            navigate('/')
            setAvatar('')
            setName('')
            setSelectedUser([])
            onClose();
        }
    }

    useEffect(() => {
        handleSearchUser()
    }, [search])
    return (
        <div className='search__user fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
            <div className='w-full max-w-lg mx-auto mt-3 h-full'>
                {/**input search user */}
                <div className='bg-white rounded overflow-hidden flex flex-col justify-between py-2'>
                    <h2 className='block text-center text-xl text-slate-800 font-semibold mt-2'>Thêm nhóm mới</h2>
                    <div className='flex border-b mx-2 py-1'>
                        <div className='w-8 h-full'>
                            <label htmlFor="avatar"
                                   className='w-full h-full flex justify-center items-center border rounded-[50%]'>
                                <button className='w-full h-full p-1' onClick={handleOpenUploadPhoto}>
                                    {loadingPhoto ? <Loading/> :
                                        <img src={avatar ? avatar : '/photo-camera.svg'}
                                             className='w-full h-full object-center object-contain rounded-[50%]'
                                             alt=""/>
                                    }
                                </button>
                                <input type="file" id='avatar' className='hidden'
                                       ref={uploadPhotoRef}
                                       onChange={handleUploadPhoto}
                                />
                            </label>
                        </div>
                        <div className='flex-1'>
                            <input
                                type='text'
                                placeholder='Nhập tên nhóm.....'
                                className='w-full outline-none px-4 h-full flex-1'
                                required
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </div>

                    </div>
                    <div className='flex'>
                        <input
                            type='text'
                            placeholder='Tìm kiếm theo tên, email, số điện thoại....'
                            className='w-full outline-none px-4 py-1 mx-2'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                        <div className='flex justify-center items-center mr-2'>
                            <IoSearchOutline size={25}/>
                        </div>
                    </div>


                </div>

                {/**display search user */}
                <div className='bg-white mt-2 w-full py-4 pl-4 rounded h-[70vh] overflow-hidden'>
                    {/**no user found */}
                    <div
                        className='h-[85%] overflow-x-hidden overflow-y-scroll scrollbar scrollbar-thumb-blue-500 scrollbar-thumb-rounded'>
                        {
                            searchUserData.length === 0 && !loading && (
                                <p className='text-center text-slate-500'>no user found!</p>
                            )
                        }

                        {
                            loading && (
                                <p><Loading/></p>
                            )
                        }

                        {
                            searchUserData.length !== 0 && !loading && (
                                searchUserData.map((user, index) => {
                                    return (
                                        <div className="flex items-center">
                                            <UserSearchCard key={user._id} user={user} onClose={onClose}/>
                                            <input type="checkbox" key={index} id={user?._id} data-name={user?.name}
                                                   value={user?._id}
                                                   onChange={handleChange}
                                                   className="mx-4 w-5 h-5 cursor-pointer"/>
                                        </div>
                                    )
                                })
                            )
                        }


                    </div>
                    <div className="w-full flex justify-center mt-4">
                        <button className='px-2 py-2 bg-blue-400 rounded text-slate-800 font-semibold'
                                onClick={handleSubmit}
                        > Thêm mới
                        </button>
                    </div>
                </div>
            </div>


            <div className='absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white' onClick={onClose}>
                <button>
                    <IoClose/>
                </button>
            </div>
        </div>
    )
}
export default NewGroupUser