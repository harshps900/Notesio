import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hero from '../assets/hero.png';
import pen from '../assets/pen.png';
import coding from '../assets/coding.png';
import arrow from '../assets/arrow.png';
import demo from '../assets/demo.mp4';
import themeVideo from '../assets/theme.mp4';
import actionsVideo from '../assets/actions.mp4';
import { useTheme } from '../Context/ThemeProvider';
import { 
    Sparkles, 
    Zap, 
    ShieldCheck, 
    LayoutGrid, 
    Palette, 
    Share2, 
    Download, 
    ArrowRight, 
    Star, 
    Users, 
    CheckCircle2, 
    Flame, 
    Mail, 
    Phone, 
    MessageSquare, 
    Sun, 
    Moon,
    FileText,
    Kanban,
    RefreshCw
} from 'lucide-react';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function LandingPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("boards");
    const { isDark, toggleTheme } = useTheme();

    const [formSubmitted, setFormSubmitted] = useState(false);
    const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!contactForm.name || !contactForm.email) return;
        setFormSubmitted(true);
        setTimeout(() => {
            setFormSubmitted(false);
            setContactForm({ name: "", email: "", message: "" });
        }, 4000);
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
            <div className="fixed top-1/3 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Navbar */}
            <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200/80'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    
                    {/* Brand Logo */}
                    <div 
                        onClick={() => navigate('/')} 
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                            N
                        </div>
                        <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Notes.io
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
                        <button 
                            onClick={() => scrollToSection('features')} 
                            className={`transition-colors hover:text-indigo-500 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                        >
                            Features
                        </button>
                        <button 
                            onClick={() => scrollToSection('showcase')} 
                            className={`transition-colors hover:text-indigo-500 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                        >
                            Workflows
                        </button>
                        <button 
                            onClick={() => scrollToSection('about')} 
                            className={`transition-colors hover:text-indigo-500 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                        >
                            About
                        </button>
                        <button 
                            onClick={() => scrollToSection('contact')} 
                            className={`transition-colors hover:text-indigo-500 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                        >
                            Contact
                        </button>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                                isDark 
                                    ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-800' 
                                    : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'
                            }`}
                            title="Toggle Theme"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Login Button */}
                        <button
                            onClick={() => navigate('/login')}
                            className={`hidden sm:inline-flex px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                                isDark 
                                    ? 'text-slate-200 hover:text-white hover:bg-slate-800/80' 
                                    : 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}
                        >
                            Log In
                        </button>

                        {/* Register Button */}
                        <button
                            onClick={() => navigate('/register')}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                        >
                            Get Started Free
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-28">
                
                {/* Hero Section */}
                <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        
                        {/* Left Hero Text */}
                        <div className="lg:col-span-6 flex flex-col items-start text-left gap-6">
                            
                            {/* Announcement Pill */}
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border backdrop-blur-md transition-colors ${
                                isDark 
                                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
                                    : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            }`}>
                                <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: '4s' }} />
                                <span>Next-Gen Smart Kanban & Workspace Notes</span>
                            </div>

                            {/* Hero Heading */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                                Organize Your Mind,{' '}
                                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                                    Accelerate Work.
                                </span>
                            </h1>

                            {/* Hero Subtitle */}
                            <p className={`text-lg sm:text-xl leading-relaxed max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Notes.io makes capturing ideas, managing task boards, collaborating with teams, and switching custom themes effortlessly simple and fast.
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <button
                                    onClick={() => navigate("/register")}
                                    className="px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 flex items-center gap-3 cursor-pointer"
                                >
                                    <span>Try Free Demo</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => scrollToSection('showcase')}
                                    className={`px-7 py-3.5 text-base font-semibold rounded-xl border transition-all duration-300 flex items-center gap-2 ${
                                        isDark 
                                            ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800' 
                                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                                    }`}
                                >
                                    <span>Watch Workflows</span>
                                </button>
                            </div>

                            {/* Value Micro Pills */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 w-full">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>100% Free Forever</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    <span>Real-Time WebSockets</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                                    <span>JWT Bank-Grade Auth</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Hero Graphic Showcase */}
                        <div className="lg:col-span-6 relative">
                            <div className={`relative rounded-3xl p-4 sm:p-6 border shadow-2xl transition-colors ${
                                isDark 
                                    ? 'bg-slate-900/90 border-slate-800 shadow-indigo-500/10' 
                                    : 'bg-white/90 border-slate-200 shadow-xl'
                            }`}>
                                {/* Window Control Dots */}
                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200/20">
                                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    <span className="ml-2 text-xs font-mono opacity-60">notes.io/workspace</span>
                                </div>

                                {/* Hero Main Image */}
                                <div className="relative rounded-2xl overflow-hidden group">
                                    <img 
                                        src={hero} 
                                        alt="Notes.io Workspace Hero" 
                                        className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Floating Glassmorphic Badge 1 */}
                                    <div className={`absolute top-4 left-4 p-3 rounded-2xl border backdrop-blur-md shadow-lg flex items-center gap-3 animate-bounce ${
                                        isDark ? 'bg-slate-900/80 border-slate-700/80 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
                                    }`} style={{ animationDuration: '6s' }}>
                                        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-500">
                                            <Kanban className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Kanban Boards</p>
                                            <p className="text-[10px] opacity-70">Custom Drag & Drop</p>
                                        </div>
                                    </div>

                                    {/* Floating Glassmorphic Badge 2 */}
                                    <div className={`absolute bottom-4 right-4 p-3 rounded-2xl border backdrop-blur-md shadow-lg flex items-center gap-3 ${
                                        isDark ? 'bg-slate-900/80 border-slate-700/80 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
                                    }`}>
                                        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-500">
                                            <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Live Sync Active</p>
                                            <p className="text-[10px] text-emerald-500 font-semibold">Socket.IO Connected</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Stats Metric Counter Banner */}
                <section className={`py-12 border-y ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-indigo-50/50 border-indigo-100'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600">10,000+</span>
                                <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Active Note Takers</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold text-purple-600">99.9%</span>
                                <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Realtime Uptime</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold text-pink-600">&lt; 50ms</span>
                                <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Sync Latency</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600">4.9 / 5.0</span>
                                <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>User Satisfaction</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Grid Cards Section */}
                <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Built for Power Users</h2>
                        <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything You Need to Manage Your Workspace</h3>
                        <p className={`text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Designed with modern aesthetics and high-performance technologies to keep you organized without friction.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        {/* Card 1 */}
                        <div className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                            isDark 
                                ? 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900' 
                                : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-indigo-500/10'
                        }`}>
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6">
                                <LayoutGrid className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Agile Kanban Boards</h4>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Organize notes by customizable status columns (To Do, In Progress, Done, Custom). Drag and move tasks easily.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                            isDark 
                                ? 'bg-slate-900/60 border-slate-800 hover:border-purple-500/50 hover:bg-slate-900' 
                                : 'bg-white border-slate-200/80 hover:border-purple-300 hover:shadow-purple-500/10'
                        }`}>
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Instant WebSocket Sync</h4>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Powered by Socket.IO. Any updates made on mobile or web sync instantaneously across all active tabs and devices.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                            isDark 
                                ? 'bg-slate-900/60 border-slate-800 hover:border-pink-500/50 hover:bg-slate-900' 
                                : 'bg-white border-slate-200/80 hover:border-pink-300 hover:shadow-pink-500/10'
                        }`}>
                            <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-6">
                                <Palette className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Dynamic Color Palettes</h4>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Personalize every note with mood-based background colors, tags, and seamless Light/Dark mode switching.
                            </p>
                        </div>

                        {/* Card 4 */}
                        <div className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                            isDark 
                                ? 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900' 
                                : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:shadow-emerald-500/10'
                        }`}>
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                                <Share2 className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">One-Click Team Sharing</h4>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Share important notes with teammates by selecting users. Collaborate on shared ideas without friction.
                            </p>
                        </div>

                        {/* Card 5 */}
                        <div className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                            isDark 
                                ? 'bg-slate-900/60 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900' 
                                : 'bg-white border-slate-200/80 hover:border-amber-300 hover:shadow-amber-500/10'
                        }`}>
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
                                <Download className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">PDF & Document Export</h4>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Download your structured notes directly as formatted PDFs or text files whenever you need offline backups.
                            </p>
                        </div>

                        {/* Card 6 */}
                        <div className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                            isDark 
                                ? 'bg-slate-900/60 border-slate-800 hover:border-blue-500/50 hover:bg-slate-900' 
                                : 'bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-blue-500/10'
                        }`}>
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Secure Trash & Restore</h4>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Accidental deletions are safe. Move items to Trash, restore them anytime, or permanently delete them with ease.
                            </p>
                        </div>

                    </div>
                </section>

                {/* Interactive Product Workflows Section */}
                <section id="showcase" className={`py-24 border-y ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-100/70 border-slate-200'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                            <h2 className="text-xs font-bold tracking-widest text-indigo-600 uppercase">See It In Action</h2>
                            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">Explore the Notes.io Experience</h3>
                        </div>

                        {/* Custom Tab Selector */}
                        <div className="flex justify-center mb-12">
                            <div className={`inline-flex p-1.5 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <button
                                    onClick={() => setActiveTab("boards")}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        activeTab === "boards"
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                            : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Kanban Boards
                                </button>
                                <button
                                    onClick={() => setActiveTab("themes")}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        activeTab === "themes"
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                            : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Theme Switching
                                </button>
                                <button
                                    onClick={() => setActiveTab("actions")}
                                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                        activeTab === "actions"
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                            : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Actions & Export
                                </button>
                            </div>
                        </div>

                        {/* Tab Content Display */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            
                            {activeTab === "boards" && (
                                <>
                                    <div className="lg:col-span-5 space-y-6">
                                        <h4 className="text-2xl sm:text-3xl font-bold">Powerful Agile Boards</h4>
                                        <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Agile teams and individual note-takers can use flexible Kanban columns to visualize tasks, limit work-in-progress, and maximize output.
                                        </p>
                                        <ul className="space-y-4 text-sm font-medium">
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                                <span>Custom Column Creation (To-Do, In-Progress, Completed)</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                                <span>Instant Drag and Drop Reordering</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="lg:col-span-7">
                                        <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
                                            <video src={demo} autoPlay loop muted className="w-full h-auto" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === "themes" && (
                                <>
                                    <div className="lg:col-span-5 space-y-6">
                                        <h4 className="text-2xl sm:text-3xl font-bold">Seamless Light & Dark Theme</h4>
                                        <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Switch between crisp high-contrast light mode and eye-friendly dark mode with a single toggle.
                                        </p>
                                        <ul className="space-y-4 text-sm font-medium">
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                                <span>System-Wide Context Preservation</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                                <span>Vibrant Color Accent Adaptations</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="lg:col-span-7">
                                        <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
                                            <video src={themeVideo} autoPlay loop muted className="w-full h-auto" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === "actions" && (
                                <>
                                    <div className="lg:col-span-5 space-y-6">
                                        <h4 className="text-2xl sm:text-3xl font-bold">Rich Actions & Collaboration</h4>
                                        <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Customize note card colors, mark favorites, export files, and share notes with teammates in seconds.
                                        </p>
                                        <ul className="space-y-4 text-sm font-medium">
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                                <span>Favorite Notes Quick Filter</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                                <span>PDF & Text Download Support</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="lg:col-span-7">
                                        <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
                                            <video src={actionsVideo} autoPlay loop muted className="w-full h-auto" />
                                        </div>
                                    </div>
                                </>
                            )}

                        </div>

                    </div>
                </section>

                {/* Call to Action Banner Section */}
                <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="relative rounded-3xl overflow-hidden p-10 sm:p-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
                        
                        {/* Background Decorative Element */}
                        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                        <div className="relative z-10 max-w-2xl text-left space-y-6">
                            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                                Ready to take your note-taking to the next level?
                            </h3>
                            <p className="text-indigo-100 text-base sm:text-lg">
                                Join thousands of developers, students, and professionals organizing their daily thoughts with Notes.io.
                            </p>
                            <div className="pt-2 flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate("/register")}
                                    className="px-8 py-4 text-base font-semibold text-indigo-700 bg-white hover:bg-slate-100 rounded-2xl shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                                >
                                    Create Free Account
                                </button>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-8 py-4 text-base font-semibold text-white border border-white/40 hover:bg-white/10 rounded-2xl transition-all cursor-pointer"
                                >
                                    Log In Now
                                </button>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Contact Us Section */}
                <section id="contact" className={`py-24 border-t ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-indigo-50/40 border-indigo-100'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`rounded-3xl border p-8 sm:p-12 ${
                            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl'
                        }`}>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                
                                {/* Left Info */}
                                <div className="lg:col-span-5 space-y-8">
                                    <div>
                                        <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Get In Touch</span>
                                        <h3 className="text-3xl sm:text-4xl font-bold mt-2">We are here to help</h3>
                                        <p className={`text-sm mt-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Have questions about features, account setup, or custom deployment? Reach out to our team.
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                                                <Phone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-400 uppercase">Support Phone</p>
                                                <p className="font-semibold text-sm">+91 1234567890</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                                                <Mail className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-400 uppercase">Official Email</p>
                                                <p className="font-semibold text-sm">support@notesio.app</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div className="pt-4 border-t border-slate-200/20">
                                        <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Connect With Us</p>
                                        <div className="flex items-center gap-3">
                                            <a href="#" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:text-indigo-500 transition-colors">
                                                <FacebookIcon fontSize="small" />
                                            </a>
                                            <a href="#" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:text-indigo-500 transition-colors">
                                                <TwitterIcon fontSize="small" />
                                            </a>
                                            <a href="#" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:text-indigo-500 transition-colors">
                                                <InstagramIcon fontSize="small" />
                                            </a>
                                            <a href="#" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:text-indigo-500 transition-colors">
                                                <LinkedInIcon fontSize="small" />
                                            </a>
                                            <a href="https://github.com/harshps900/Notesio" target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:text-indigo-500 transition-colors">
                                                <GitHubIcon fontSize="small" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Form */}
                                <div className="lg:col-span-7">
                                    {formSubmitted ? (
                                        <div className="h-full min-h-[300px] rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-8 flex flex-col items-center justify-center text-center space-y-4">
                                            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
                                            <h4 className="text-2xl font-bold text-emerald-600">Message Sent Successfully!</h4>
                                            <p className="text-sm text-slate-500">Thank you for contacting Notes.io. Our team will get back to you shortly.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleFormSubmit} className="space-y-5">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    required 
                                                    value={contactForm.name}
                                                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                                    placeholder="John Doe" 
                                                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                                                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                                    }`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    required 
                                                    value={contactForm.email}
                                                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                                    placeholder="john@example.com" 
                                                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                                                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                                    }`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Message</label>
                                                <textarea 
                                                    rows={4} 
                                                    required
                                                    value={contactForm.message}
                                                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                                    placeholder="Tell us what features you'd like to see..." 
                                                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                                                        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                                    }`}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full py-4 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 cursor-pointer"
                                            >
                                                Send Message
                                            </button>
                                        </form>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className={`py-12 border-t text-center text-xs ${isDark ? 'bg-slate-950 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">N</div>
                        <span className="font-bold text-sm text-indigo-600">Notes.io</span>
                        <span>© {new Date().getFullYear()} Harsh Pal Singh. All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-6 font-medium">
                        <button onClick={() => navigate('/register')} className="hover:text-indigo-500 transition-colors">Sign Up</button>
                        <button onClick={() => navigate('/login')} className="hover:text-indigo-500 transition-colors">Log In</button>
                        <a href="https://github.com/harshps900/Notesio" target="_blank" rel="noreferrer" className="hover:text-indigo-500 transition-colors">GitHub</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}
