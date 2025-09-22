import { useState } from 'react'
import { DndContext, closestCenter, useDroppable, useDraggable } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Task from './Task'
import Column from './Column'
export default function Pratice() {
    const column = [
        { id: 'todo', title: 'Todo' },
        { id: 'progress', title: 'Progress' },
        { id: 'done', title: 'Done' }
    ]
    const INITIAL_TASKS = [{
        id: '1',
        title: 'ReasershWork',
        description: 'this is work',
        status: 'todo'
    },
    {
        id: '2',
        title: 'Cooking',
        description: 'this is Cooking work',
        status: 'todo'
    },
    {
        id: '3',
        title: 'Driving',
        description: 'this is Driving work',
        status: 'progress'
    }
    ]
    const [tasks, setTasks] = useState(INITIAL_TASKS)
    const handleDragEnd = (event) => {
        const { active, over } = event
        if (!over) return

        if (active.id !== over.id) {
            
            const taskId = active.id
        const    newStatus = over.id
            setTasks(() => tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task))
        }
        console.log(tasks)
    }

    return (
        <>
            <div  className='p-4'>
                <div className='flex gap-8'>
                    <DndContext onDragEnd={handleDragEnd}>
                        {column.map((col) => {
                            return (
                            <Column
                                key={col.id}
                                col={col}
                                tasks={tasks.filter(task => task.status === col.id)}
                            />

                            )
                        })}
                    </DndContext>
                </div>

            </div>
            <div>

            </div>
        </>
    )
}