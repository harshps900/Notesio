import { faHeart, faHome, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useTheme } from "../Context/ThemeProvider"
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
export default function SideBar({
    toggleHome, isHomeCLick,
    toggleFavourites, isFavouritesClick,
    toggleTrash, isTrashClick,
}) {
    const { isDark, toggleTheme } = useTheme();
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

    return (
        <>
            <div className={`md:w-64 w-full h-screen md:h-[100%]   shadow-lg md:mt-0 md:pr-3 md:pt-2 flex flex-col ${isDark ? 'bg-gray-900 text-gray-100' : ' text-gray-800 bg-gray-50 '} `}>
                {/* sidebar components */}
                <div className=" flex flex-col mt-6  justify-between gap-85 ">
                <div className="flex flex-col  gap-4">
                    <button
                        onClick={toggleHome}
                        className={`flex items-center gap-2 ml-4 mr-4 md:mr-0 md:0 px-4 rounded-2xl py-3 hover:bg-indigo-600 hover:text-white ${isHomeCLick ? ' bg-indigo-500 text-white' : ' '} cursor-pointer`}>
                        <FontAwesomeIcon icon={faHome} />Home
                    </button>
                    <button
                        onClick={toggleFavourites}
                        className={`flex items-center gap-2 ml-4 mr-4 md:mr-0 md:0 px-4 rounded-2xl py-3 hover:bg-indigo-600 hover:text-white ${isFavouritesClick ? ' bg-indigo-500 text-white ' : ' '}} hover:bg-indigo-300 cursor-pointer`}>
                        <FontAwesomeIcon icon={faHeart} className="" />Favourites
                    </button>
                    <button
                        onClick={toggleTrash}
                        className={`flex items-center gap-2 px-4 ml-4 mr-4 md:mr-0 md:0  rounded-2xl py-3 font-serif ${isTrashClick ? ' bg-indigo-500 text-white  ' : 'text-red-400 hover:text-red-500'}  cursor-pointer`}
                    >
                        <FontAwesomeIcon icon={faTrash} />Trash
                    </button>
                    </div>
                    <div className="p-4 flex  justify-center    gap-2">
                        <FormGroup>
                            <FormControlLabel
                                control={<MaterialUISwitch
                                    checked={isDark}
                                    onChange={toggleTheme}
                                />}
                                label={isDark ? 'Light Mode' : 'Dark Mode'}
                            />
                        </FormGroup>
                    </div>
                </div>
            </div>
        </>
    )
}