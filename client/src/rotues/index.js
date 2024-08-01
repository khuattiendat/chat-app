import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Register from "../pages/Register";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout";
import Forgotpassword from "../pages/Forgotpassword";
import Login from "../pages/Login";
import PDFFile from "../components/PDFFile";
import TestForm from "../components/TestForm";

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
                path: 'form',
                element: <TestForm/>
            },
            {
                path: 'pdf',
                element: <PDFFile/>
            },
            {
                path: "",
                element: <Home/>,
                children: [
                    {
                        path: ':groupId',
                        element: <MessagePage/>
                    },
                    {
                        path: '/group/:groupId',
                        element: <MessagePage/>
                    },
                    {
                        path: '/user/:userId',
                        element: <MessagePage/>
                    }
                ]
            }
        ]
    }
])

export default router