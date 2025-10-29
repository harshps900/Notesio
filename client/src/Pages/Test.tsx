import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Card Component (equivalent to your SortableCard)
const Card = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    padding: '10px',
    margin: '5px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      Card {id}
    </div>
  );
};

// Section Component (equivalent to your SortableSection + inner component)
const Section = ({ id, title, cards }: { id: string, title: string, cards: string[] }) => {
  const { setNodeRef } = useSortable({ id });

  const sectionStyle: React.CSSProperties = {
    padding: '20px',
    margin: '10px 0',
    border: '2px dashed #eee',
    backgroundColor: '#f9f9f9',
  };

  return (
    <div ref={setNodeRef} style={sectionStyle}>
      <h3>{title}</h3>
      <SortableContext items={cards} strategy={horizontalListSortingStrategy}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {cards.map(cardId => (
            <Card key={cardId} id={cardId} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

// Main Test Component
export const Test = () => {
  const [sectionOrder, setSectionOrder] = useState<string[]>(['section-1', 'section-2']);
  const [cardOrders, setCardOrders] = useState<{ [key: string]: string[] }>({
    'section-1': ['A', 'B', 'C'],
    'section-2': ['D', 'E', 'F'],
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const findSection = (cardId: string) => Object.keys(cardOrders).find(section => cardOrders[section].includes(cardId));

    const sourceSection = findSection(active.id as string);
    let destinationSection = findSection(over.id as string);

    if (!destinationSection && sectionOrder.includes(over.id as string)) {
        destinationSection = over.id as string;
    }
    
    if (!sourceSection || !destinationSection) {
        return;
    }

    if (sourceSection === destinationSection) {
      setCardOrders(prev => ({
        ...prev,
        [sourceSection]: arrayMove(
          prev[sourceSection],
          prev[sourceSection].indexOf(active.id as string),
          prev[sourceSection].indexOf(over.id as string)
        ),
      }));
    } else {
      setCardOrders(prev => {
        const sourceItems = [...prev[sourceSection]];
        const destinationItems = [...prev[destinationSection]];
        const sourceIndex = sourceItems.indexOf(active.id as string);
        const [movedItem] = sourceItems.splice(sourceIndex, 1);

        const destIndex = destinationItems.includes(over.id as string)
          ? destinationItems.indexOf(over.id as string)
          : destinationItems.length;

        destinationItems.splice(destIndex, 0, movedItem);

        return {
          ...prev,
          [sourceSection]: sourceItems,
          [destinationSection]: destinationItems,
        };
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
        {sectionOrder.map(sectionId => (
          <Section 
            key={sectionId} 
            id={sectionId} 
            title={sectionId.toUpperCase()} 
            cards={cardOrders[sectionId]} 
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};