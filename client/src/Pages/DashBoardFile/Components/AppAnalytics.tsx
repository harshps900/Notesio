//@ts-nocheck
import React from 'react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { InfoIcon } from 'lucide-react';
import { SortableSection } from './dnd';
import { CardRenderer } from './CardRender';
import { ResizableCard } from './ResizableCard';

interface AppAnalyticsProps {
    mockData: {
        appUsage: any[];
        unUsedAppUsage: any[];
        browserUsage: any[];
        [key: string]: any;
    };
    cardOrders: {
        [key: string]: string[];
    };
    sectionId: string;
    isWidgetVisible: (id: string) => boolean;
    isDragAndDropActive:boolean;
    toggleWidgetVisibility: (id: string) => void;
    cardSizes: { [key: string]: { width: number | string; height: number | string } };
    onResizeStart: () => void;
    onResizeStop: (id: string, size: { width: number; height: number }) => void;
    isResizing: boolean;
    isFlex: boolean;
}


export const AppAnalytics: React.FC<AppAnalyticsProps> = ({ mockData, cardOrders, sectionId, isWidgetVisible,toggleWidgetVisibility,isDragAndDropActive, cardSizes, onResizeStart, onResizeStop, isResizing, isFlex, ...props }) => {

    const cards = cardOrders[sectionId] || [];

    const layoutClass = isResizing || isFlex
        ? "flex flex-wrap gap-4"
        : "grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-4";
        
    const getSize = (id: string) => {
        return cardSizes[id] || { width: '100%', height: 320 };
    };

    return (
        <SortableSection id={sectionId} isDragAndDropActive={isDragAndDropActive}>
            <h2 className="flex gap-2 text-2xl font-bold border-b-2 border-indigo-200 pb-2 text-indigo-800 mb-6">
            Application Usage & Popularity
                <span className='flex items-center' data-tooltip-id="info-tooltip" data-tooltip-content="Analysis of application usage and device distribution.">
                    <InfoIcon className="w-5 h-5" />
                </span>
            </h2>
            <div className={layoutClass}>
                <SortableContext items={cards} strategy={rectSortingStrategy}>
                    {cards.map((cardId) => {
                        if (!isWidgetVisible(cardId)) return null;
                        return (
                            <ResizableCard
                                id={cardId}
                                key={cardId}
                                minHeight={600}
                                minWidth={350}
                                isDragAndDropActive={isDragAndDropActive}
                                onRemove={toggleWidgetVisibility}
                                size={getSize(cardId)}
                                onResizeStart={onResizeStart}
                                onResizeStop={onResizeStop}
                                isResizing={isResizing}
                            >
                                <CardRenderer cardId={cardId} mockData={mockData} {...props} />
                            </ResizableCard>
                        );
                    })}
                </SortableContext>
            </div>
        </SortableSection>
    );
};