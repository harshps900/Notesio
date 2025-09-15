import Form from "./ReusableComponents/Form"
import RegisterField from './ReusableComponents/RegisterField'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
export default function Register() {
    const navigate = useNavigate()
    const { RegisterUser } = useAuth()
    const [formError, setFormError] = useState("");
    const handleRegister = async (formData) => {
        const success = await RegisterUser(formData);
        if (success) navigate("/login");
    };
    return (
        <>
            <div className="flex fixed w-xl h-screen md:w-full justify-center items-center md:items-center md:justify-center bg-gradient-to-br from-indigo-400 to-gray-100    md:py-10 md:px-20">
                <div className="flex flex-col md:flex-row w-full max-w-2xl bg-indigo-50 shadow-2xl rounded-2xl overflow-hidden ml-6 mr-40  ">
                    <div className={`hidden md:flex flex-1 bg-indigo-500  p-5 flex-col justify-center items-center`}>
                        <div className="max-w-xs">
                            <h2 className="text-4xl font-serif text-center text-gray-50 mb-4">Join Us!</h2>
                            <p className="text-sm text-blue-100 font-mono text-center mb-6">
                                Create your account to start your journey with us.
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 p-8 md:p-2 md:pt-6 mb-8">
                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-8">
                                <h2 className={`text-3xl font-serif text-center text-gray-800   mb-2 `}>Create Account</h2>
                                <p className="font-sans" >Fill in your details to register</p>
                            </div>
                            <Form
                                fields={RegisterField}
                                onSubmit={handleRegister}
                                buttonText="Register"
                                buttonClassName="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                            />
                            {formError && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                                    {formError}
                                </div>
                            )}
                            <div className="mt-6 text-center">
                                <p className={`text-sm`}>
                                    Already have an account?{" "}
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="font-medium text-blue-600 hover:underline"
                                    >
                                        Login
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}