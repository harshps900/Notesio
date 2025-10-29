//@ts-nocheck
import React, { useState, useEffect } from 'react';
import { SortableCard } from './dnd';
import { Resizable } from 're-resizable';

interface ResizableCardProps {
    id: string;
    children: React.ReactNode;
    isDragAndDropActive: boolean;
    onRemove: (id: string) => void;
    size: { width: number | string; height: number | string };
    onResizeStart: () => void;
    onResizeStop: (id: string, size: { width: number; height: number }) => void;
    onResizing?: (id: string, size: { width: number; height: number }) => void;
    isResizing?: boolean;
    minHeight?: number;
    minWidth?: number; // <-- ADD THIS PROP
}

export const ResizableCard: React.FC<ResizableCardProps> = ({ 
    id, 
    children, 
    isDragAndDropActive, 
    onRemove, 
    size = { width: '100%', height: 180 }, 
    onResizeStart, 
    onResizeStop, 
    onResizing, 
    isResizing,
    minHeight = 150,
    minWidth = 250 // <-- ADD THIS PROP WITH A DEFAULT
}) => {
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

    const resizeHandles = isTouchDevice
        ? { topRight: isDragAndDropActive, bottomRight: isDragAndDropActive, bottomLeft: isDragAndDropActive, topLeft: isDragAndDropActive }
        : {
            top: isDragAndDropActive, right: isDragAndDropActive, bottom: isDragAndDropActive, left: isDragAndDropActive,
            topRight: isDragAndDropActive, bottomRight: isDragAndDropActive, bottomLeft: isDragAndDropActive, topLeft: isDragAndDropActive,
        };

    return (
        <div style={{ margin: isResizing ? '8px' : '4px' }}>
            <SortableCard id={id} isDragAndDropActive={isDragAndDropActive} onRemove={onRemove}>
                <Resizable
                    size={{ width: size.width, height: size.height }}
                    minHeight={minHeight}
                    minWidth={minWidth} // <-- UPDATE THIS LINE
                    defaultSize={{ width: size.width, height: size.height }}
                    onResizeStart={onResizeStart}
                    onResize={(e, direction, ref) => {
                        const rect = ref.getBoundingClientRect();
                        const next = { width: Math.round(rect.width), height: Math.round(rect.height) };
                        if (onResizing) onResizing(id, next);
                    }}
                    onResizeStop={(e, direction, ref, d) => {
                        const rect = ref.getBoundingClientRect();
                        onResizeStop(id, { width: Math.round(rect.width), height: Math.round(rect.height) });
                    }}
                    enable={resizeHandles}
                >
                    {children}
                </Resizable>
            </SortableCard>
        </div>
    );
};