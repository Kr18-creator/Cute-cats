"use client";
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useState, useEffect } from 'react';
import Card from "./components/Card";

const documents = [
  { type: "bank-draft", title: "Bank Draft", position: 0 },
  { type: "bill-of-lading", title: "Bill of Lading", position: 1 },
  { type: "invoice", title: "Invoice", position: 2 },
  { type: "bank-draft-2", title: "Bank Draft 2", position: 3 },
  { type: "bill-of-lading-2", title: "Bill of Lading 2", position: 4 },
];

export default function Home() {
  const [items, setItems] = useState(documents);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure that DnD context only runs on the client
    setMounted(true);
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      console.log("Dropped outside a droppable area");
      return;
    }

    if (active.id !== over.id) {
      console.log("Moving item:", active.id, "to", over.id);

      const activeIndex = items.findIndex((item) => item.type === active.id);
      const overIndex = items.findIndex((item) => item.type === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        const newItems = Array.from(items);
        const [movedItem] = newItems.splice(activeIndex, 1);
        newItems.splice(overIndex, 0, movedItem);

        setItems(newItems);
      }
    }
  };

  if (!mounted) {
    // Prevent rendering the DndContext on the server
    return null;
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {items.map((doc) => (
          <DroppableContainer key={doc.type} id={doc.type}>
            <DraggableCard document={doc} />
          </DroppableContainer>
        ))}
      </div>
    </DndContext>
  );
}

// Droppable container component
function DroppableContainer({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        border: isOver ? '2px dashed blue' : '2px solid transparent',
        padding: '8px',
      }}
    >
      {children}
    </div>
  );
}

function DraggableCard({ document }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: document.type, // Use a unique identifier for each item
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      <Card document={document} />
    </div>
  );
}
