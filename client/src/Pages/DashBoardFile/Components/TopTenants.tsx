//@ts-nocheck
import React from 'react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { InfoIcon } from 'lucide-react';
import { SortableSection } from './dnd';
import { CardRenderer } from './CardRender';
import { ResizableCard } from './ResizableCard';

interface TopTenantsProps {
    cardOrders: {
        [key: string]: string[];
    };
    isWidgetVisible: (id: string) => boolean;
    sectionId: string;
    mockData: {
        tenantsByLocation: Record<string, any[]>;
        mostUsedApps: any[];
        [key: string]: any;
    };
    userLocationMarkers: any[];
    tooltipContent: any;
    setTooltipContent: (content: any) => void;
    tooltipPosition: any;
    setTooltipPosition: (position: any) => void;
    mapZoom: number;
    handleMapZoomIn: () => void;
    handleMapZoomOut: () => void;
    selectedLocation: string;
    handleLocationChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    isDragAndDropActive:boolean;
    toggleWidgetVisibility: (id: string) => void;
    cardSizes: { [key: string]: { width: number | string; height: number | string } };
    onResizeStart: () => void;
    onResizeStop: (id: string, size: { width: number; height: number }) => void;
    isResizing: boolean;
    isFlex: boolean;
}

export const TopTenants: React.FC<TopTenantsProps> = ({
    cardOrders,
    isWidgetVisible,
    sectionId,
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
        ? "flex flex-wrap gap-6"
        : "grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-6";

    const getSize = (id: string) => {
        return cardSizes[id] || { width: '100%', height: 360 };
    };

    return (
        <SortableSection id={sectionId } isDragAndDropActive={isDragAndDropActive}>
            <h2 className="flex gap-2 text-2xl font-bold border-b-2 border-indigo-200 pb-2 text-indigo-800 mb-6">
                Tenant Location & Ranking
                <span className='flex items-center' data-tooltip-id="info-tooltip" data-tooltip-content="Geographic distribution and performance of tenants.">
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
                                minHeight={450}
                                minWidth={350}
                                isDragAndDropActive={isDragAndDropActive}
                                onRemove={toggleWidgetVisibility}
                                size={getSize(cardId)}
                                onResizeStart={onResizeStart}
                                onResizeStop={onResizeStop}
                                isResizing={isResizing}
                            >
                                <CardRenderer cardId={cardId} {...props} />
                            </ResizableCard>
                        );
                    })}
                </SortableContext>
            </div>
        </SortableSection>
    );
};