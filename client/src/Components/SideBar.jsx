import { faNoteSticky } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useEffect } from "react"
export default function SideBar() {
    return (
        <>
            <div className="flex flex-col bg-gray-100 text-gray-800    mt-4 ">

                <div className="flex  flex-col justify-center items-center gap-5">
                    
                    <div className="bg-indigo-600 text-white rounded-lg w-9 h-9 flex items-center justify-center mr-2">
                        <span className="font-bold text-lg">N</span>
                    </div>
                </div>
            </div>
        </>
    )
}