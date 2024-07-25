import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout";
import Forgotpassword from "../pages/Forgotpassword";
import Login from "../pages/Login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "register",
                element: <AuthLayouts><Register/></AuthLayouts>
            },
            {
                path: "login",
                element: <AuthLayouts><Login/></AuthLayouts>
            },
            {
                path: 'forgot-password',
                element: <AuthLayouts><Forgotpassword/></AuthLayouts>
            },
            {
                path: "",
                element: <Home/>,
                children: [
                    {
                        path: ':userId',
                        element: <MessagePage/>
                    }
                ]
            }
        ]
    }
])

export default router