//@ts-nocheck
import React from 'react';
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { InfoIcon } from 'lucide-react';
import { SortableSection } from './dnd';
import { CardRenderer } from './CardRender';
import { ResizableCard } from './ResizableCard';

interface SystemOverviewProps {
    mockData: any;
    cardOrders: { [key: string]: string[] };
    sectionId: string;
    isWidgetVisible: (id: string) => boolean;
    isDragAndDropActive: boolean;
    toggleWidgetVisibility: (id: string) => void;
    cardSizes: { [key: string]: { width: number | string; height: number | string } };
    onResizeStart: () => void;
    onResizeStop: (id: string, size: { width: number; height: number }) => void;
    isResizing: boolean;
    isFlex: boolean;
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({
    mockData,
    cardOrders,
    sectionId,
    isWidgetVisible,
    isDragAndDropActive,
    toggleWidgetVisibility,
    cardSizes,
    onResizeStart,
    onResizeStop,
    isResizing,
    isFlex,
    ...props
}) => {
    const cards = cardOrders[sectionId] || [];

    const layoutClass = isResizing || isFlex
        ? "flex flex-wrap gap-4"
        : "grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4";


    return (
        <SortableSection id={sectionId} isDragAndDropActive={isDragAndDropActive}>
            <h2 className="flex gap-2 text-2xl font-bold border-b-2 border-indigo-200 pb-2 text-indigo-800 mb-6">
                System Overview (Key Metrics)
                <span className='flex items-center' data-tooltip-id="info-tooltip" data-tooltip-content="Key performance indicators for the entire system.">
                    <InfoIcon className="w-5 h-5" />
                </span>
            </h2>
            <div className={layoutClass}>
                <SortableContext items={cards} strategy={rectSortingStrategy}>
                    {cards.map((cardId) => {
                        if (!isWidgetVisible(cardId)) return null;
                        return (
                            <ResizableCard
                                key={cardId}
                                id={cardId}
                                minHeight={180}
                                minWidth={280}
                                isDragAndDropActive={isDragAndDropActive}
                                onRemove={toggleWidgetVisibility}
                                size={cardSizes[cardId]}
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