import LoginField from "./ReusableComponents/LoginField";
import Form from "./ReusableComponents/Form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
export default function Login() {
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();
    const { LoginUser, user } = useAuth()
    const handleLogin = async (formData) => {
        try {
            const result = await LoginUser(formData);
            if (result.success) {
                
                navigate('/Notesio');
                console.log('Login successful', user)
            } else {
                setFormError("Login failed. Please try again.");
                navigate('/login');
            }
        } catch (error) {
            setFormError("Login failed. Please try again.");
        }
    };
    return (
        <div >
            <div className=" fixed w-full flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-400 to-gray-100 p-2">
                <div className="flex flex-col md:flex-row w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden ">
                    {/* Left side - Welcome banner */}
                    <div className="hidden md:flex md:flex-col bg-indigo-500 text-gray-50 w-1/2 p-8 justify-center items-center">
                        <h2 className="text-4xl font-serif mb-4">Welcome Back!</h2>
                        <p className="text-center font-sans text-lg">
                            Enter your credentials to access your account and continue your journey with us.
                        </p>
                    </div>
                    {/* Right side - Login Form */}
                    <div className="flex-1 p-8 md:p-8 ">
                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-serif mb-2 text-gray-800">Sign In</h2>
                                <p className="text-gray-600">Please enter your login details</p>
                            </div>
                            {/* Error message */}
                            {formError && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                                    {formError}
                                </div>
                            )}
                            {/* Form */}
                            <Form
                                fields={LoginField}
                                onSubmit={handleLogin}
                                buttonText="Login"
                                buttonClassName="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                            />
                        </div>
                        {/* Footer */}
                        <div className="mt-6 text-center text-gray-600 text-sm flex flex-col justify-center items-center gap-4">
                            <a href="#" className="hover:text-indigo-600">Forgot password?</a>
                            <p className="mt-4">
                                Don't have an account?{' '}
                                <button
                                    onClick={() => navigate('/register')}
                                    className="text-indigo-400 font-medium hover:underline">
                                    Register
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
