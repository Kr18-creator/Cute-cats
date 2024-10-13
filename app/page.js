"use client";
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useState, useEffect } from 'react';
import Card from "./components/Card";

export default function Home() {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Fetch initial data from the backend API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('http://localhost:8000/documents');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      }
    };

    fetchDocuments();
    setMounted(true);
  }, []);

  const handleDragEnd = async (event) => {
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
        
        // Update state
        setItems(newItems);
        
        // Send updated order to backend
        await updateDocumentOrder(newItems);
      }
    }
  };

  const updateDocumentOrder = async (newItems) => {
    try {
      const response = await fetch('http://localhost:8000/documents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItems),
      });

      if (!response.ok) {
        throw new Error('Failed to update document order');
      }

      console.log('Document order updated successfully');
    } catch (error) {
      console.error(error);
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
