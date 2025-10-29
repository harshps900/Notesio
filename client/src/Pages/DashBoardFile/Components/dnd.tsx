//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MinusCircle } from 'lucide-react';

interface SortableCardProps {
    id: string;
    children: React.ReactNode;
    className?: string;
    isDragAndDropActive: boolean;
    onRemove: (id: string) => void;
    style?: React.CSSProperties;
}

export const SortableCard = ({ id, children, className = '',isDragAndDropActive, onRemove, style: customStyle }: SortableCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
        animateLayoutChanges: () => false,
    });

    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(pointer: coarse)');
        
        const checkTouchDevice = () => {
            const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || mediaQuery.matches;
            setIsTouchDevice(isTouch);
        };

        checkTouchDevice();

        const mediaQueryListener = () => checkTouchDevice();
        mediaQuery.addEventListener('change', mediaQueryListener);
        window.addEventListener('resize', checkTouchDevice);
        return () => {
            mediaQuery.removeEventListener('change', mediaQueryListener);
            window.removeEventListener('resize', checkTouchDevice);
        };
    }, []);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        ...customStyle, 
    };
    
    const removeButtonClasses = isTouchDevice
    ? 'opacity-100'
    : 'opacity-0 group-hover:opacity-100';
    

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative  group ${className}`}
        >
            {isDragAndDropActive ? (
                <>
                    <div
                        {...attributes}
                        {...listeners}
                        className="absolute top-3 left-3 cursor-grab active:cursor-grabbing z-10 text-gray-400 hover:text-gray-600">
                        <GripVertical className="w-4 h-4" />
                    </div>
                    <button
                        onClick={() => onRemove(id)}
                        className={`absolute top-2 right-3 z-10 text-gray-400 cursor-pointer transition-opacity ${removeButtonClasses}`}
                    >
                        <MinusCircle className="w-4 h-4" />
                    </button>
                </>
            ):(
                    <></>
            )}
            {children}
        </div>
    );
};

export const SortableSection = ({ id, children, className = '',isDragAndDropActive }: SortableCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id,animateLayoutChanges: () => false, });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={`relative ${className}`}>
            
            {isDragAndDropActive && (
                <div {...attributes} {...listeners} className="absolute -left-5 top-2 cursor-grab active:cursor-grabbing z-10 text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-5 h-5" />
                </div>
            )}
            {children}
        </div>
    );
};