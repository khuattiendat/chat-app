import {useState} from "react";
import {useNavigate} from "react-router-dom";

const TestForm = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        name: '',
        color: '',
        category: '',
        price: ''
    })
    const handleChange = (e) => {
        const {name, value} = e.target
        setData({...data, [name]: value})
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const local = localStorage.getItem('data')
        if (!local) {
            localStorage.setItem('data', JSON.stringify([data]))
        }
        const dataLocal = JSON.parse(local)
        dataLocal.push(data)
        localStorage.setItem('data', JSON.stringify(dataLocal))
        navigate('/pdf')
    }
    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 bg-white flex justify-center items-center'>
            <div className="w-full max-w-xs">
                <form className="bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Tên sản phẩm
                        </label>
                        <input
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username" name='name' value={data.name} type="text" placeholder="Họ tên"/>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            màu sắc
                        </label>
                        <input
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password" name='color' value={data.color} type="text" placeholder="Màu sắc"/>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Loại sản phẩm
                        </label>
                        <input
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password" name='category' value={data.category} type="text"
                            placeholder="Loại sản phẩm"/>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Giá sản phẩm
                        </label>
                        <input
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password" name='price' value={data.price} type="text" placeholder="Giá sản phẩm"/>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit">
                            in file
                        </button>

                    </div>
                </form>
            </div>
        </div>


    );

}
export default TestForm;