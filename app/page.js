"use client";
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { useState, useEffect } from 'react';
import Card from "./components/Card";

export default function Home() {
  const [items, setItems] = useState([]); // Start with an empty array
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(Date.now());
  const [saveInterval, setSaveInterval] = useState(null);
  const [isDirty, setIsDirty] = useState(false); // Track if items have changed

  useEffect(() => {
    // Ensure that DnD context only runs on the client
    setMounted(true);
  }, []);

  const fetchDocuments = async () => {
    const response = await fetch('http://localhost:8000/documents');
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await fetchDocuments();
        setItems(docs);
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    };
    loadDocuments();
  }, []); 

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      console.log("Dropped outside a droppable area");
      return;
    }

    if (active.id !== over.id) {
      const activeIndex = items.findIndex((item) => item.type === active.id);
      const overIndex = items.findIndex((item) => item.type === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        const newItems = Array.from(items);
        const [movedItem] = newItems.splice(activeIndex, 1);
        newItems.splice(overIndex, 0, movedItem);

        setItems(newItems);
        setIsDirty(true); // Mark as dirty since items have changed
      }
    }
  };

  const saveDocumentsToAPI = async () => {
    if (!isDirty) return; // Avoid saving if no changes have been made

    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:8000/documents', {
        method: 'PUT', // Use PUT for updating
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items), // Ensure items match Document model
      });

      if (!response.ok) {
        throw new Error('Failed to save documents');
      }

      setLastSaveTime(Date.now());
      console.log('Documents saved successfully');
      setIsDirty(false); // Reset dirty flag after saving
    } catch (error) {
      console.error('Error saving documents:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Start saving every 5 seconds
    if (!saveInterval) {
      const interval = setInterval(() => {
        saveDocumentsToAPI();
      }, 5000);
      setSaveInterval(interval);
    }

    // Cleanup the interval on unmount
    return () => {
      clearInterval(saveInterval);
    };
  }, [items, saveInterval, isDirty]); // Re-run when items change or isDirty changes

  const timeSinceLastSave = Math.floor((Date.now() - lastSaveTime) / 1000); // in seconds

  if (!mounted) {
    // Prevent rendering the DnDContext on the server
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
      {isSaving && <div className="spinner">Saving...</div>}
      <div className="last-save-time">
        {isSaving ? `Saving...` : `Last saved ${timeSinceLastSave} seconds ago`}
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
