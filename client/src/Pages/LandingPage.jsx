import hero from '../assets/hero.png'
import { useNavigate } from "react-router-dom"
import pen from '../assets/pen.png'
import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"
import { useState } from "react"
import demo from '../assets/demo.mp4'
import theme from '../assets/theme.mp4'
import actions from '../assets/actions.mp4'
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useTheme } from '../Context/ThemeProvider'
import coding from '../assets/coding.png'
import arrow from '../assets/arrow.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
export default function LandingPage() {
    const navigate = useNavigate()
    const [value, setValue] = useState("1")
    const { isDark, toggleTheme } = useTheme()
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }
    const MaterialUISwitch = styled(Switch)(({ theme }) => ({
        width: 62,
        height: 34,
        padding: 7,
        '& .MuiSwitch-switchBase': {
            margin: 1,
            padding: 0,
            transform: 'translateX(6px)',
            '&.Mui-checked': {
                color: '#fff',
                transform: 'translateX(22px)',
                '& .MuiSwitch-thumb:before': {
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                        '#fff',
                    )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
                },
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: '#aab4be',
                    ...theme.applyStyles('dark', {
                        backgroundColor: '#8796A5',
                    }),
                },
            },
        },
        '& .MuiSwitch-thumb': {
            backgroundColor: '#001e3c',
            width: 32,
            height: 32,
            '&::before': {
                content: "''",
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
            },
            ...theme.applyStyles('dark', {
                backgroundColor: '#003892',
            }),
        },
        '& .MuiSwitch-track': {
            opacity: 1,
            backgroundColor: '#aab4be',
            borderRadius: 20 / 2,
            ...theme.applyStyles('dark', {
                backgroundColor: '#8796A5',
            }),
        },
    }));
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('hii')
    }
    return (
        <>
            {/* Navbar - Made responsive */}
            <nav className={`fixed left-0 right-0 w-full top-0 z-40 flex flex-wrap md:flex-nowrap items-center justify-between px-4 sm:px-6 py-4 shadow-sm backdrop-blur-xl ${isDark ? 'bg-gray-800' : 'bg-white/70'} `}>
                {/* Logo */}
                <div

                    className="flex items-center cursor-pointer"
                >
                    <div className={` text-white rounded-lg w-9 h-9 flex items-center justify-center mr-2${isDark ? ' bg-indigo-700' : ' bg-indigo-600'}`}>
                        <span className="font-bold text-lg">N</span>
                    </div>
                    <p className={` font-bold text-xl hidden sm:block ${isDark ? ' text-indigo-500' : 'text-indigo-600'}`}>Notes.io</p>
                </div>
                {/* Links */}
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 md:gap-x-6 order-4  md:order-2 w-full md:w-auto mt-2 md:mt-0">
                    <button className={`text-sm sm:text-base ${isDark ? ' text-indigo-100' : 'text-indigo-600 font-medium hover:text-indigo-800 transition-colors'} transition-colors`}>
                        Features
                    </button>
                    <button className={`text-sm sm:text-base ${isDark ? ' text-indigo-100' : 'text-indigo-600 font-medium hover:text-indigo-800 transition-colors'} transition-colors`}>
                        About
                    </button>
                    <button className={`text-sm sm:text-base ${isDark ? ' text-indigo-100' : 'text-indigo-600 font-medium hover:text-indigo-800 transition-colors'} transition-colors`}>
                        Contact Us
                    </button>
                </div>
                <div className="order-2 md:order-3">
                    <FormGroup>
                        <FormControlLabel
                            control={<MaterialUISwitch
                                checked={isDark}
                                onChange={toggleTheme}
                            />}
                            className={`${isDark ? ' text-indigo-100' : 'text-indigo-600 font-medium hover:text-indigo-800 transition-colors'} transition-colors}`}
                            label={<span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>}
                        />
                    </FormGroup>
                </div>
            </nav>

            {/* Main */}
            <main className={`w-full min-h-screen pt-32 md:pt-20 ${isDark ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                {/* Hero Section */}
                <section className="min-h-screen flex flex-col md:flex-row items-center gap-8 justify-center px-4 sm:px-8 md:px-20 py-10">
                    {/* Left content */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6 max-w-lg">
                        <h1 className={`font-serif text-4xl md:text-5xl  ${isDark ? ' text-indigo-100' : 'text-indigo-600'} font-bold leading-tight`}>
                            Forget messy notes,<br />
                            <span className={`${isDark ? ' text-indigo-600' : 'text-indigo-600'} font-serif text-4xl md:text-5xl font-bold leading-tight`}>Notes.io</span> makes it simple
                        </h1>
                        <p className={` text-lg ${isDark ? ' text-indigo-100' : 'text-indigo-300'}`}>
                            Organize your notes smarter and faster. Stay productive and focused.
                        </p>
                        <button
                            onClick={() => navigate("/register")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-xl cursor-pointer transition-all shadow-md"
                        >
                            Try Demo
                        </button>
                    </div>

                    {/* Right image */}
                    <div className="mt-10 md:mt-0">
                        <img src={hero} alt="Hero" className="max-w-lg w-full " />
                    </div>
                </section>

                {/* Features Section */}
                <section className={`py-20 relative ${isDark ? 'bg-gray-600' : 'bg-indigo-100'}`} id="features">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-16 md:gap-20 z-20">
                        {/* Feature 1 */}
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            {/* Card */}
                            <div className={`relative order-2 md:order-1 ${isDark ? ' bg-gray-500 border-gray-100' : 'bg-white'} rounded-2xl shadow-xl border max-w-lg md:max-w-md p-6`}>
                                <img src={pen} alt="Pen" className="absolute -top-8 -right-2 w-16 h-16" />
                                <h2 className={`text-lg md:text-xl ${isDark ? ' text-gray-50' : 'text-gray-800'} font-semibold`}>Web Design</h2>
                                <p className={` mt-1 md:mt-3 ${isDark ? ' text-gray-50' : 'text-gray-600'} `}>
                                    Web design is the process of building user-friendly websites.
                                </p>
                                <h3 className={`md:mt-4 md:text-lg mt-2 text-sm ${isDark ? ' text-gray-50' : 'text-gray-800'} font-medium`}>🎯 Goals</h3>
                                <p className={` mt-1 md:mt-3 ${isDark ? ' text-gray-50' : 'text-gray-600'} `}>
                                    Make the website easy to use and drive growth.
                                </p>
                                <h3 className={`md:mt-4 md:text-lg mt-2 text-sm  font-medium ${isDark ? ' text-gray-50' : 'text-gray-800'} `}>🏃 What to do?</h3>
                                <ul className={` mt-1 md:mt-2  ${isDark ? ' text-gray-50' : 'text-gray-600'} list-disc list-inside`}>
                                    <li>Conduct Research</li>
                                    <li>Develop Wireframes</li>
                                </ul>
                            </div>
                            {/* Detail */}
                            <div className="order-1 md:order-2 max-w-lg md:max-w-md text-center md:text-left">
                                <h1 className={` text-3xl md:text-4xl font-bold  ${isDark ? ' text-gray-50' : 'text-indigo-600'}`}>Write Notes</h1>
                                <p className={`md:mt-3 mt-2 ${isDark ? ' text-gray-50' : 'text-indigo-500'}`}>Write any note you want</p>
                                <button
                                    onClick={() => navigate("/register")}
                                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-xl cursor-pointer transition-all shadow-md"
                                >
                                    Try Now
                                </button>
                            </div>
                        </div>
                        <img src={arrow} className='hidden md:block absolute md:top-108 md:left-160 transform -translate-x-1/3 -translate-y-1/3 md:w-36 md:h-25 z-0' alt="arrow" />
                        {/* <img src={arrow} className='md:hidden block absolute md:top-1/2 top-136 w-14 h-14 left-8 rotate-12 md:left-1/2 transform -translate-x-1/6 -translate-y-1/6 md:w-36 md:h-36 z-0' alt="arrow" /> */}
                        {/* Feature 2 */}
                        <div className="flex flex-col md:flex-row items-center z-20 gap-10">
                            {/* Detail */}
                            <div className="max-w-lg md:max-w-md text-center md:text-left">
                                <h1 className={`text-4xl font-bold ${isDark ? ' text-gray-50' : 'text-indigo-600'}`}>Learn Facts</h1>
                                <p className={`mt-3 ${isDark ? ' text-gray-50' : 'text-indigo-500'}`}>It keeps your mind sharp</p>
                                <button
                                    onClick={() => navigate("/register")}
                                    className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-xl cursor-pointer transition-all shadow-md"
                                >
                                    Try Now
                                </button>
                            </div>
                            {/* Card */}
                            <div className={`relative rounded-2xl shadow-xl border max-w-lg md:max-w-md p-6 ${isDark ? 'bg-gray-500 border-gray-100' : 'bg-white'}`}>
                                <span className=' absolute -right-2   text-6xl -top-5'>💡</span>
                                <h2 className={`text-xl font-semibold ${isDark ? ' text-gray-50' : 'text-gray-800'}`}>Learning</h2>
                                <p className={`mt-3 ${isDark ? ' text-gray-50' : 'text-gray-600'} `}>
                                    Learning facts daily helps keep your brain sharp.
                                </p>
                                <h3 className={`mt-4 text-lg font-medium ${isDark ? ' text-gray-50' : 'text-gray-800'}`}>🎯 Goals</h3>
                                <p className={`mt-2 ${isDark ? ' text-gray-50' : 'text-gray-600'}`}>
                                    Stay updated and enhance knowledge.
                                </p>
                                <h3 className={`mt-4 text-lg font-medium ${isDark ? ' text-gray-50' : 'text-gray-800'}`}>🏃 What to do?</h3>
                                <ul className={`mt-2 ${isDark ? ' text-gray-50' : 'text-gray-600'} list-disc list-inside`}>
                                    <li>Read Daily Facts</li>
                                    <li>Revise Frequently</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Product features in a tab */}
                <section className={`py-20 ${isDark ? 'bg-gray-500' : 'bg-indigo-50'}`}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-10 z-20">
                        <h1 className={`text-3xl md:text-4xl font-semibold text-center ${isDark ? ' text-gray-100' : 'text-indigo-500'} `}>Discover the features that make Notes.io so easy to use</h1>
                        <div className='w-full'>
                            <Box sx={{ width: "100%", typography: "body1" }}>
                                <TabContext value={value}>
                                    <Box sx={{}}>
                                        <div className={`flex justify-center items-center mt-4 pb-4 ${isDark ? 'text-gray-100' : 'text-indigo-500'}`}>
                                            <TabList onChange={handleChange} aria-label="profile tabs">
                                                <Tab sx={{ color: isDark ? 'white' : 'primary.main' }} label="Boards" value="1" />
                                                <Tab sx={{ color: isDark ? 'white' : 'primary.main' }} label="Theme" value="2" />
                                                <Tab sx={{ color: isDark ? 'white' : 'primary.main' }} label="Actions" value="3" />
                                            </TabList>
                                        </div>
                                    </Box>
                                    <TabPanel value="1" >
                                        <div className='flex flex-col lg:flex-row justify-between items-center gap-10'>
                                            <div className='flex flex-col gap-4 max-w-xl'>
                                                <h1 className={`font-semibold text-2xl  ${isDark ? ' text-gray-100' : 'text-indigo-500'}`}>Powerful agile boards</h1>
                                                <ul className='flex flex-col gap-2'>
                                                    <li className='conatiner  contain-content'>
                                                        ✔️ <span className={`font-semibold ${isDark ? ' text-gray-100' : 'text-indigo-500'}`}>Kanban boards:</span> <br />
                                                        <span className={`text-justify  ${isDark ? ' text-gray-100' : 'text-indigo-400'}`}>
                                                            Agile and DevOps teams can use flexible kanban boards to visualize workflows, limit work-in-progress, and maximize efficiency as a team. Templates make it easy to get started quickly and customize as you go
                                                        </span></li>
                                                    <li className={`conatiner  contain-content `}>
                                                        ✔️ <span className={`font-semibold ${isDark ? ' text-gray-100' : 'text-indigo-500'}`}>Choose your own adventure:</span> <br />
                                                        <span className={`text-justify px-1 ${isDark ? ' text-gray-100' : 'text-indigo-400'}`}>
                                                            Notes.io is flexible enough to mold to your team's own unique way of working, can can customize your own Kanban boards
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* video */}
                                            <video
                                                src={demo}
                                                autoPlay
                                                loop
                                                muted
                                                className="w-full max-w-xl h-auto rounded-lg shadow-lg"
                                            />
                                        </div>
                                    </TabPanel>
                                    <TabPanel value="2" >
                                        <div className='flex flex-col lg:flex-row justify-between items-center gap-10'>
                                            <div className='flex flex-col gap-4 max-w-xl'>
                                                <h1 className={`font-semibold text-2xl  ${isDark ? ' text-gray-100' : 'text-indigo-500'} `}>Theme Switching Experience</h1>
                                                <ul className='flex flex-col gap-2'>
                                                    <li className={`conatiner  contain-content ${isDark ? ' text-gray-100' : 'text-indigo-500'}`}>
                                                        ✔️ <span className='font-semibold'>Theme Switching:</span> <br />
                                                        <span className='text-justify px-5'>
                                                            Change Theme as you like 😉
                                                        </span></li>
                                                </ul>
                                            </div>
                                            {/* video */}
                                            <video
                                                src={theme}
                                                autoPlay
                                                loop
                                                muted
                                                className="w-full max-w-xl h-auto rounded-lg shadow-lg"
                                            />
                                        </div>
                                    </TabPanel>
                                    <TabPanel value="3" >d
                                        <div className='flex flex-col lg:flex-row justify-between items-center gap-10'>
                                            <div className='flex flex-col gap-4 max-w-xl'>
                                                <h1 className={`font-semibold text-2xl ${isDark ? ' text-gray-100' : 'text-indigo-500'}`}>Powerfull features you can't miss!!!</h1>
                                                <ul className='flex flex-col gap-2'>
                                                    <li className={`conatiner  contain-content ${isDark ? ' text-gray-100' : 'text-indigo-500'}`}>
                                                        ✔️ <span className='font-semibold'>Custom Color:</span> <br />
                                                        <span className='text-justify px-2'>
                                                            Customize your note color according to your mood.
                                                            <span className='text-justify px-2'>Multiple options in Colors</span>
                                                        </span></li>
                                                    <li className={`conatiner  contain-content ${isDark ? ' text-gray-100' : 'text-indigo-500'}`}>
                                                        ✔️ <span className='font-semibold'>Share with your Team:</span> <br />
                                                        <span className='text-justify px-2'>
                                                            Work with Team.
                                                            <span className='text-justify px-'>Share your Important notes with your team</span>
                                                        </span>
                                                    </li>
                                                    <li className={`conatiner  contain-content ${isDark ? ' text-gray-100' : 'text-indigo-500'}`}>
                                                        ✔️ <span className='font-semibold'>Download the notes:</span> <br />
                                                        <span className='text-justify px-2'>
                                                            Export your important notes
                                                        </span></li>
                                                    <li className={`conatiner  contain-content ${isDark ? ' text-gray-100' : 'text-indigo-500'}`}>
                                                        ✔️ <span className='font-semibold'>Favourite your Note:</span> <br />
                                                        <span className='text-justify px-2'>
                                                            Favourite your note , you can't miss your note
                                                        </span></li>
                                                </ul>
                                            </div>
                                            {/* video */}
                                            <video
                                                src={actions}
                                                autoPlay
                                                loop
                                                muted
                                                className="w-full max-w-xl h-auto rounded-lg shadow-lg"
                                            />
                                        </div>
                                    </TabPanel>
                                </TabContext>
                            </Box>
                        </div>
                    </div>
                </section>
                {/* Description */}
                <section className={`py-20 flex flex-col justify-center px-4 sm:px-8 ${isDark ? 'bg-gray-600' : 'bg-indigo-100'}`}>
                    <div className="container mx-auto flex flex-col items-center z-20 text-center">
                        <img src={coding} className='w-full max-w-lg h-auto' alt='coding' />
                        <h1 className={`text-3xl md:text-4xl mt-8 ${isDark ? ' text-gray-50' : 'text-gray-800'} font-semibold`}>
                            Ready to take your <span className={`${isDark ? ' text-indigo-700' : 'text-indigo-600'}`}>notes</span><br />  to the next level?
                        </h1>
                        <div className='flex justify-center gap-4 mb-8 mt-7 items-center'>
                            <button
                                onClick={() => navigate("/register")}
                                className="bg-indigo-600 hover:bg-indigo-700  text-white py-3 px-8 rounded-xl cursor-pointer transition-all shadow-md"
                            >
                                Try Demo
                            </button>
                        </div>
                    </div>
                </section>
                {/* Contact Us */}
                <section className={`py-20 flex justify-center px-4 sm:px-8 ${isDark ? 'bg-gray-700' : 'bg-indigo-100'}`}>
                    <div className={`container mx-auto rounded-2xl max-w-5xl flex flex-col lg:flex-row justify-between gap-8 p-6 md:p-10 ${isDark ? 'bg-gray-600' : 'bg-indigo-400'}`}>
                        {/* first part */}
                        <div className='flex flex-col gap-8'>
                            <p className={`text-xl ${isDark ? ' text-gray-50' : 'text-gray-800'}`}>/get in touch/</p>
                            <div>
                                <h1 className={`text-3xl sm:text-4xl md:text-5xl ${isDark ? ' text-gray-50' : 'text-gray-800'} font-bold`}>We are always ready<br /> to help you and<br /> answer your question</h1>
                            </div>
                            <div className='flex  sm:flex-row justify-between items-start sm:items-center gap-8 mt-2'>
                                <div className='flex flex-col justify-center  items-center'>
                                    <h1 className={` text-lg font-semibold ${isDark ? ' text-gray-50' : 'text-gray-800'}`}>Call  Center</h1>
                                    <p className={`text-sm ${isDark ? ' text-gray-50' : 'text-gray-800'}`}>
                                        +91 1234567890
                                        <br />
                                        +91 9876543210
                                    </p>
                                </div>
                                <div className='flex flex-col justify-center  '>
                                    <h1 className={`text-lg font-semibold ${isDark ? ' text-gray-50' : 'text-gray-800'}`}>Email </h1>
                                    <p className={`text-sm ${isDark ? ' text-gray-50' : 'text-gray-800'}`}>
                                        abc@gmail.com
                                    </p>
                                </div>
                            </div>
                            {/* social media */}
                            <div className='flex flex-col gap-2 items-start'>
                                <h1 className={`text-lg font-semibold ${isDark ? ' text-gray-50' : 'text-gray-800'}`}>Social Media</h1>
                                <div className={`flex gap-2 justify-center items-center`}>
                                    <FacebookIcon className={` border-t-0 border-l-0 border-2 hover:cursor-pointer  ${isDark ? ' text-gray-800 bg-gray-100 border-gray-800' : 'text-indigo-600 bg-gray-100 border-indigo-700 '} `} />
                                    <TwitterIcon className={` border-t-0 border-l-0 border-2 hover:cursor-pointer ${isDark ? ' text-gray-800 bg-gray-100 border-gray-800' : 'text-indigo-500 bg-gray-100 border-indigo-700 '} `} />
                                    <InstagramIcon className={` border-t-0 border-l-0 border-2 hover:cursor-pointer  ${isDark ? ' text-gray-800 bg-gray-100 border-gray-800' : 'text-gray-800 bg-gray-100 border-indigo-700 '} `} />
                                    <LinkedInIcon className={` border-t-0 border-l-0 border-2  hover:cursor-pointer ${isDark ? ' text-gray-800 bg-gray-100 border-gray-800' : 'text-indigo-600 bg-gray-100 border-indigo-700 '} `} />
                                    <GitHubIcon className={` border-t-0 border-l-0 border-2  hover:cursor-pointer ${isDark ? ' text-gray-800 bg-gray-100 border-gray-800' : 'text-gray-800 bg-gray-100 border-indigo-700 '} `} />
                                </div>
                            </div>
                        </div>
                        {/* second part */}
                        <div className='flex flex-col justify-center lg:w-1/2'>
                            <span className='flex flex-col items-start gap-2'>
                                <h1 className={`text-3xl md:text-4xl font-semibold ${isDark ? ' text-gray-50' : 'text-gray-800'}`}>Get in Touch</h1>
                                <p className={`text-lg ${isDark ? ' text-gray-50' : 'text-gray-800'} `}>Tell us your goals and what note taking means to you</p>
                            </span>
                            <form className={`flex flex-col items-start justify-center mt-6 w-full`} >
                                <label className={`block text-sm font-medium ${isDark ? ' text-gray-50' : 'text-gray-800'} mb-2`}>Name:</label>
                                <input type='text' placeholder='Name' className={`w-full px-4 py-3 border rounded-lg ${isDark ? ' bg-gray-500 text-gray-50' : ' bg-gray-100 text-gray-900 '} mb-4`} />
                                <label className={`block text-sm font-medium ${isDark ? ' text-gray-50' : 'text-gray-800'} mb-2`}>Email:</label>
                                <input type='email' placeholder='Email' className={`w-full px-4 py-3 border rounded-lg ${isDark ? ' bg-gray-500 text-gray-50' : ' bg-gray-100 text-gray-900 '} mb-4`} />
                                <label className={`block text-sm font-medium ${isDark ? ' text-gray-50' : 'text-gray-800'} mb-2`}>Message:</label>
                                <textarea placeholder='Message' className={`w-full  px-4 py-3  border rounded-lg ${isDark ? ' bg-gray-500 text-gray-50' : ' bg-gray-100 text-gray-900 '} `} />
                                <button
                                    onClick={(e) => handleSubmit(e)}
                                    className={`bg-indigo-600 w-full border-t-0 border-l-0 border border-indigo-400 mt-4 hover:bg-indigo-700  text-white py-3 px-8 rounded-xl cursor-pointer transition-all shadow-md`}>
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
