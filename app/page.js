"use client"
import { DndContext, useDraggable } from '@dnd-kit/core';
import { useState } from 'react';
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

  const handleDragEnd = (event) => {
    console.log("triggered")
    const { active, over } = event;
    console.log(active)
    console.log("over", over)


    if (active) {
      console.log("happ")
      const activeIndex = items.findIndex((item) => item.type === active?.id);
      const overIndex = items.findIndex((item) => item.type === over?.id);

      const newItems = Array.from(items);
      const [movedItem] = newItems.splice(activeIndex, 1);
      newItems.splice(overIndex, 0, movedItem);

      setItems(newItems);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <h1>Home</h1>
      <div className="grid grid-cols-3 gap-4">
        {items.map((doc) => (
          <DraggableCard key={doc.position} document={doc} />
        ))}
      </div>
    </DndContext>
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
