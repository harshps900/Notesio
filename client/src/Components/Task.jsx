import { useState } from 'react'
import {  useDraggable } from '@dnd-kit/core'

export default function Task({ task }) {
    const { setNodeRef, attributes, listeners, interactivity, transform } = useDraggable({
        id: task.id
    })
    const style = transform ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`
    } : undefined
    return (
        <>
            <div style={style} key={task.id} ref={setNodeRef} {...attributes} {...listeners} className="p-2 mt-2 bg-white rounded shadow">
                <p className="font-bold">{task.title}</p>
                <p>{task.description}</p>
            </div>
        </>
    )
}