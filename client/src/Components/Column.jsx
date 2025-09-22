

import { useState } from 'react'
import { useDroppable, } from '@dnd-kit/core'

import Task from './Task'
export default function Column({ col, tasks, }) {
    const { setNodeRef } = useDroppable({
        id: col.id
    })

    return (
        <>
            <div ref={setNodeRef} key={col.id} className='flex flex-col gap-4 p-4 bg-gray-200 rounded-lg'>
                <div>
                    {col.title}
                </div>
                <div >
                    {tasks.filter((task) => task.status === col.id).map((task) => {

                        return (
                            <>
                                <Task key={task.id} task={task} />
                            </>
                        )
                    })}
                </div>
            </div>
        </>
    )
}