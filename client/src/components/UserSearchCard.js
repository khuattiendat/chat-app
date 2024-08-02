import React from 'react'
import Avatar from './Avatar'
import {Link} from 'react-router-dom'

const UserSearchCard = ({user, onClose}) => {
    return (
        <label htmlFor={user?._id} className='flex-1 flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200
            hover:border hover:border-primary rounded cursor-pointer'>

            <div>
                <Avatar
                    width={50}
                    height={50}
                    name={user?.name}
                    userId={user?._id}
                    imageUrl={user?.profile_pic}
                />
            </div>
            <div>
                <div className=' font-semibold text-ellipsis line-clamp-1'>
                    {user?.name}
                </div>
                <p className=' text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
                <p className=' text-sm text-ellipsis line-clamp-1'>{user?.phone}</p>
            </div>
        </label>

    )
}

export default UserSearchCard
