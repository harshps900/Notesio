import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthProvider";
import { useTheme } from "../Context/ThemeProvider";
import Form from "./ReusableComponents/Form";
import RegisterField from "./ReusableComponents/RegisterField";
import { 
    Sparkles, 
    ShieldCheck, 
    Zap, 
    ArrowLeft, 
    Sun, 
    Moon, 
    CheckCircle2, 
    UserPlus 
} from "lucide-react";

export default function Register() {
    const [formError, setFormError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { RegisterUser } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const handleRegister = async (formData) => {
        setFormError("");
        setIsSubmitting(true);
        try {
            const result = await RegisterUser(formData);
            if (result && result.success) {
                navigate("/login");
            } else {
                setFormError("Registration failed. Please verify your details.");
            }
        } catch (error) {
            setFormError("Server error during registration. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden font-sans ${
            isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
        }`}>
            
            {/* Ambient Background Glow Spheres */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar Actions */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
                <button
                    onClick={() => navigate("/")}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border backdrop-blur-md transition-all ${
                        isDark 
                            ? "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800" 
                            : "bg-white/80 border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-slate-100"
                    }`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                </button>

                <button
                    onClick={toggleTheme}
                    className={`p-2.5 rounded-xl border backdrop-blur-md transition-all ${
                        isDark 
                            ? "bg-slate-900/80 border-slate-800 text-amber-400 hover:bg-slate-800" 
                            : "bg-white/80 border-slate-200 text-indigo-600 hover:bg-slate-100"
                    }`}
                    title="Toggle Theme"
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
            </div>

            {/* Main Auth Container */}
            <div className={`w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 z-10 my-12 transition-colors ${
                isDark ? "bg-slate-900/90 border-slate-800 shadow-indigo-500/10" : "bg-white/90 border-slate-200 shadow-xl"
            }`}>
                
                {/* Left Side: Gradient Banner */}
                <div className="md:col-span-5 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-xl">
                            N
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight">Notes.io</span>
                    </div>

                    {/* Join Us Content */}
                    <div className="my-10 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-purple-100">
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Create Your Free Account</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                            Start Taking Smarter Notes Today.
                        </h2>
                        <p className="text-purple-100 text-sm leading-relaxed">
                            Join thousands of creators, engineers, and teams managing their daily workflow effortlessly.
                        </p>
                    </div>

                    {/* Feature Micro List */}
                    <div className="space-y-2.5 pt-4 border-t border-white/20 text-xs font-medium text-purple-100">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                            <span>100% Free Forever</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-300" />
                            <span>Custom Kanban Statuses</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-indigo-200" />
                            <span>PDF Export & Search</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Register Form */}
                <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
                    <div className="space-y-6 max-w-sm mx-auto w-full">
                        
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Create Account</h3>
                            <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                                Fill in your details to get started
                            </p>
                        </div>

                        {/* Error Notice */}
                        {formError && (
                            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold flex items-center gap-2 animate-shake">
                                <span>⚠️ {formError}</span>
                            </div>
                        )}

                        {/* Form */}
                        <Form
                            fields={RegisterField}
                            onSubmit={handleRegister}
                            buttonText={isSubmitting ? "Creating Account..." : "Complete Registration"}
                            buttonClassName={`w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 transition-all cursor-pointer ${
                                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                        />

                        {/* Divider & Switch link */}
                        <div className="text-center pt-4 border-t border-slate-200/20 text-sm space-y-3">
                            <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                                Already have an account?{" "}
                                <button
                                    onClick={() => navigate("/login")}
                                    className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline cursor-pointer"
                                >
                                    Log In Here
                                </button>
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}