import { useTheme } from "../Context/ThemeProvider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGears, faHeart, faHome, faTrash, faUser } from "@fortawesome/free-solid-svg-icons"
export default function UserSideBar({
    isUserHomeClick, toggleUserHome,
    isProfileClick, toggleProfile,
    isSettingsClick, toggleSettings,
    
}) {
    const { isDark} = useTheme();



    return (
        <>
            <div className={`md:w-64 w-full h-screen md:h-[100%]   shadow-lg md:mt-0 md:pr-3 md:pt-2 flex flex-col ${isDark ? 'bg-gray-900 text-gray-100' : ' text-gray-800 bg-gray-50 '} `}>
                {/* sidebar components */}
                <div className=" flex flex-col mt-6  justify-between gap-85 ">
                <div className="flex flex-col  gap-4">
                    <button
                        onClick={toggleUserHome}
                        className={`flex items-center gap-2 ml-4 mr-4 md:mr-0 md:0 px-4 rounded-2xl py-3 hover:bg-indigo-600 hover:text-white ${isUserHomeClick ? ' bg-indigo-500 text-white' : ' '} cursor-pointer`}>
                        <FontAwesomeIcon icon={faHome} />Home
                    </button>
                    <button
                        onClick={toggleProfile}
                        className={`flex items-center gap-2 ml-4 mr-4 md:mr-0 md:0 px-4 rounded-2xl py-3 hover:bg-indigo-600 hover:text-white ${isProfileClick ? ' bg-indigo-500 text-white ' : ' '}} hover:bg-indigo-300 cursor-pointer`}>
                        <FontAwesomeIcon icon={faUser} className="" />Profile
                    </button>
                    <button
                        onClick={toggleSettings}
                        className={`flex items-center gap-2 px-4 ml-4 mr-4 md:mr-0 md:0  rounded-2xl py-3 font-serif ${isSettingsClick ? ' bg-indigo-500 text-white  ' : 'text-indigo-400 hover:text-indigo-500'}  cursor-pointer`}
                    >
                        <FontAwesomeIcon icon={faGears} />Settings
                    </button>
                    </div>
                    
                </div>
            </div>
        </>
    )
}