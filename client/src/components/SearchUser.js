import React, {useEffect, useState} from 'react'
import {IoSearchOutline} from "react-icons/io5";
import Loading from './Loading';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast'
import axios from 'axios';
import {IoClose} from "react-icons/io5";
import {useDispatch, useSelector} from "react-redux";
import {searchUser} from "../apis/user";
import {createAxios} from "../utils/createInstance";
import {setAll} from "../redux/userSlice";

const SearchUser = ({onClose}) => {
    const user = useSelector(state => state?.user)
    const [searchUserData, setSearchUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const dispatch = useDispatch();
    const axiosJWT = createAxios(user, dispatch, setAll);


    const handleSearchUser = async () => {
        try {
            setLoading(true)
            let data = {
                search: search,
                userId: user?._id
            }
            const response = await searchUser(data, user?.accessToken, axiosJWT)
            setLoading(false)

            setSearchUser(response?.data)

        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    useEffect(() => {
        handleSearchUser()
    }, [search])

    console.log("searchUserData", searchUserData)
    return (
        <div className='search__user fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
            <div className='w-full max-w-lg mx-auto mt-10'>
                {/**input search user */}
                <div className='bg-white rounded h-14 overflow-hidden flex '>
                    <input
                        type='text'
                        placeholder='Search user by name, email, phone....'
                        className='w-full outline-none py-1 h-full px-4'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                    <div className='h-14 w-14 flex justify-center items-center'>
                        <IoSearchOutline size={25}/>
                    </div>
                </div>

                {/**display search user */}
                <div className='bg-white mt-2 w-full p-4 rounded h-full max-h-[70vh] overflow-scroll'>
                    {/**no user found */}
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
                                    <UserSearchCard key={user._id} user={user} onClose={onClose}/>
                                )
                            })
                        )
                    }


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

export default SearchUser
