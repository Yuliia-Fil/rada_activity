import React, { useEffect, useState } from "react";
import axios from "axios";
import BillCard from "./BillCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function BillBoard() {
  const [columns, setColumns] = useState({
    new: { name: "Нові закони", items: [] },
    processed: { name: "Опрацьовані закони", items: [] },
  });
  const [loading, setLoading] = useState(true);

  // Завантажуємо закони з сервера
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await axios.get("http://localhost:3000/bills");
        const newBills = res.data.filter((b) => b.status === "new");
        const processedBills = res.data.filter((b) => b.status === "processed");

        setColumns({
          new: { name: "Нові закони", items: newBills },
          processed: { name: "Опрацьовані закони", items: processedBills },
        });
      } catch (err) {
        console.error("Error fetching bills:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  // Перетягування карток
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Копіюємо масиви карток
    const sourceItems = Array.from(columns[source.droppableId].items);
    const destItems = Array.from(columns[destination.droppableId].items);

    // Витягуємо переміщену картку
    const [moved] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, moved);

    // Оновлюємо локальні колонки
    setColumns((prev) => ({
      ...prev,
      [source.droppableId]: { ...prev[source.droppableId], items: sourceItems },
      [destination.droppableId]: {
        ...prev[destination.droppableId],
        items: destItems,
      },
    }));

    // Оновлюємо статус на сервері
    try {
      await axios.patch(`http://localhost:3000/bills/${moved.number}/status`, {
        status: destination.droppableId === "processed" ? "processed" : "new",
      });
    } catch (err) {
      console.error("Failed to update status on server:", err);
    }
  };

  if (loading) return <p>Loading bills...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Канбан-дошка законів</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: "16px" }}>
          {Object.entries(columns).map(([id, column]) => (
            <Droppable key={id} droppableId={id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    backgroundColor: "#f4f4f5",
                    padding: "10px",
                    borderRadius: "8px",
                    width: "50%",
                    minHeight: "400px",
                  }}
                >
                  <h2>{column.name}</h2>
                  {column.items.map((bill, index) => (
                    <Draggable
                      key={bill.number}
                      draggableId={bill.number}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <BillCard bill={bill} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
